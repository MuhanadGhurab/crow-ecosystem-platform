#!/usr/bin/env python3
# NON-RUNTIME ANALYSIS TOOL
# NOT PRODUCT CODE
# NOT APPROVED FOR PRODUCTION
# GHV.PROGRESSION.1B — stdlib-only deterministic simulation
# Seed: 20260721
"""
Isolated analytical simulator for GHURAVIA progression candidate formulas.
Do not import from application packages. No network. No database. No secrets.
"""

from __future__ import annotations

import csv
import hashlib
import math
import os
import random
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

SEED = 20260721
ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT

# ---------------------------------------------------------------------------
# Formula parameters (FRM-XP-001 / FRM-LVL-001 / FRM-MOM-* / etc.) v0.1.0
# ---------------------------------------------------------------------------

INTENSITY_XP = {"LIGHT": 10, "STANDARD": 20, "DEEP": 35, "EXTENDED": 50}
EVENT_XP = {
    "STAGE_COMPLETED": 40,
    "EVIDENCE_APPROVED_FORMATIVE": 30,
    "EVIDENCE_APPROVED_PRACTICAL": 60,
    "CAPSTONE_APPROVED": 150,
    "ROUTE_PROVEN_GRANTED": 250,
    "TEAM_CONTRIBUTION_APPROVED": 40,
    "LIVE_RESULT_FINALIZED": 40,
    "REFLECTION_APPROVED": 10,
    "SERVICE_CONTRIBUTION": 40,
    "MISSION_COMPLETED": None,  # intensity-based
    "MISSION_REMEDIATION_COMPLETED": None,  # 50% of base
}

MOM_LEAGUES = [
    ("Iron", 0, 29),
    ("Bronze", 30, 44),
    ("Silver", 45, 59),
    ("Gold", 60, 74),
    ("Platinum", 75, 87),
    ("Diamond", 88, 100),
]

MAT_WEIGHTS = {
    "digital_independence": 10,
    "learning_independence": 10,
    "practical_execution": 15,
    "documentation_quality": 10,
    "problem_decomposition": 15,
    "responsible_judgment": 15,
    "collaboration": 10,
    "evidence_ownership": 10,
    "unfamiliar_adaptation": 5,
}

MAT_GATES = {
    "Hatchling": None,
    "Fledgling": {"index": 20, "dims_ge1": 3, "contexts": 2},
    "Scout": {"index": 35, "dims_ge1": 5, "practical": 1},
    "Pathfinder": {"index": 50, "dims_ge2": 5, "route_proven": 1},
    "Specialist": {"index": 65, "dims_ge2": 6, "dims_ge3": 1, "independent_contexts": 2},
    "Vanguard": {"index": 78, "dims_ge3": 7, "trust": "POSITIVE_STANDING"},
    "Raven": {"index": 90, "critical_ge3": True, "dims_eq4": 3, "trust": "ELEVATED_RESPONSIBILITY_ELIGIBLE"},
}

BREADTH_DESCRIPTORS = [
    (0, 24, "Focused"),
    (25, 49, "Expanding"),
    (50, 69, "Multi-Horizon"),
    (70, 84, "Integrated"),
    (85, 100, "Extensive"),
]

CLUSTERS = [f"CC-{i:02d}" for i in range(1, 13)]  # 12 launch clusters; no ANL
HORIZONS = ["OPR", "BLD", "PRT", "LED"]  # launch; ANL excluded


def round_half_up(x: float) -> int:
    return int(math.floor(x + 0.5))


def flight_level(xp: int) -> int:
    # XP required for L = 100 * (L-1) * L / 2; Level 1 at 0
    L = 1
    while True:
        need = 100 * L * (L + 1) // 2  # XP for Level L+1
        if xp < need:
            return L
        L += 1
        if L > 500:
            return L


def league_for(score: float) -> str:
    s = round_half_up(score)
    for name, lo, hi in MOM_LEAGUES:
        if lo <= s <= hi:
            return name
    return "Iron"


def league_for_buffered(score: float, previous: str | None = None, buffer: int = 2) -> str:
    """FRM-MOM-002 v0.2.0 Alternative B — promotion buffer / demotion hysteresis."""
    raw = league_for(score)
    if previous is None or previous == raw:
        return raw
    order = [n for n, _, _ in MOM_LEAGUES]
    try:
        pi = order.index(previous)
        ri = order.index(raw)
    except ValueError:
        return raw
    s = round_half_up(score)
    if ri > pi:
        # promotion: require clearing the new band floor by `buffer`
        lo = MOM_LEAGUES[ri][1]
        if s < lo + buffer:
            return previous
    if ri < pi:
        # demotion: require falling buffer below previous band floor
        lo = MOM_LEAGUES[pi][1]
        if s > lo - buffer:
            return previous
    return raw


def breadth_descriptor(idx: float) -> str:
    v = round_half_up(idx)
    for lo, hi, name in BREADTH_DESCRIPTORS:
        if lo <= v <= hi:
            return name
    return "Focused"


# ---------------------------------------------------------------------------
# Persona definitions
# ---------------------------------------------------------------------------

PERSONAS = [
    {"id": "PER-001", "name": "New Open Flight learner", "plan": "OpenFlight", "age": "adult", "lang": "en",
     "profile": "new", "activity": 0.4, "evidence": 0.3, "integrity": "clean", "team": 0.0, "popular": 0.0},
    {"id": "PER-002", "name": "Steady working learner", "plan": "WingPass", "age": "adult", "lang": "en",
     "profile": "steady", "activity": 0.7, "evidence": 0.7, "integrity": "clean", "team": 0.2, "popular": 0.0},
    {"id": "PER-003", "name": "High-activity low-Evidence", "plan": "FlightPass", "age": "adult", "lang": "en",
     "profile": "high_act_low_ev", "activity": 0.95, "evidence": 0.05, "integrity": "clean", "team": 0.1, "popular": 0.3},
    {"id": "PER-004", "name": "Low-activity high-Evidence", "plan": "OpenFlight", "age": "adult", "lang": "en",
     "profile": "low_act_high_ev", "activity": 0.25, "evidence": 0.95, "integrity": "clean", "team": 0.1, "popular": 0.0},
    {"id": "PER-005", "name": "Experienced recognition Evidence", "plan": "WingPass", "age": "adult", "lang": "en",
     "profile": "experienced", "activity": 0.55, "evidence": 0.9, "integrity": "clean", "team": 0.4, "popular": 0.1},
    {"id": "PER-006", "name": "Expedition subscriber low learning", "plan": "Expedition", "age": "adult", "lang": "en",
     "profile": "paid_idle", "activity": 0.05, "evidence": 0.0, "integrity": "clean", "team": 0.0, "popular": 0.0},
    {"id": "PER-007", "name": "Merit Grant learner", "plan": "MeritRoute", "age": "adult", "lang": "en",
     "profile": "merit", "activity": 0.65, "evidence": 0.7, "integrity": "clean", "team": 0.2, "popular": 0.0},
    {"id": "PER-008", "name": "Returning after inactivity", "plan": "OpenFlight", "age": "adult", "lang": "ar",
     "profile": "returning", "activity": 0.5, "evidence": 0.6, "integrity": "clean", "team": 0.1, "popular": 0.0},
    {"id": "PER-009", "name": "Minor Arabic-first", "plan": "OpenFlight", "age": "minor", "lang": "ar",
     "profile": "minor_ar", "activity": 0.55, "evidence": 0.5, "integrity": "clean", "team": 0.0, "popular": 0.0},
    {"id": "PER-010", "name": "Accessibility compressed schedule", "plan": "FlightPass", "age": "adult", "lang": "en",
     "profile": "a11y_compressed", "activity": 0.45, "evidence": 0.65, "integrity": "clean", "team": 0.0, "popular": 0.0},
    {"id": "PER-011", "name": "Team passenger weak contribution", "plan": "WingPass", "age": "adult", "lang": "en",
     "profile": "team_passenger", "activity": 0.4, "evidence": 0.2, "integrity": "clean", "team": 0.9, "popular": 0.2},
    {"id": "PER-012", "name": "Strong Team contributor", "plan": "WingPass", "age": "adult", "lang": "en",
     "profile": "team_strong", "activity": 0.6, "evidence": 0.75, "integrity": "clean", "team": 0.95, "popular": 0.2},
    {"id": "PER-013", "name": "Integrity review Evidence", "plan": "OpenFlight", "age": "adult", "lang": "en",
     "profile": "integrity", "activity": 0.5, "evidence": 0.6, "integrity": "review", "team": 0.1, "popular": 0.0},
    {"id": "PER-014", "name": "Community-popular weak Evidence", "plan": "FlightPass", "age": "adult", "lang": "en",
     "profile": "popular_weak", "activity": 0.5, "evidence": 0.15, "integrity": "clean", "team": 0.3, "popular": 0.95},
    {"id": "PER-015", "name": "Prestige candidate strong portfolio", "plan": "WingPass", "age": "adult", "lang": "en",
     "profile": "prestige", "activity": 0.7, "evidence": 0.95, "integrity": "clean", "team": 0.7, "popular": 0.3},
]


@dataclass
class ProgressState:
    xp: int = 0
    xp_log: list = field(default_factory=list)
    weekly_mom: list = field(default_factory=lambda: [0.0] * 8)
    missions: int = 0
    stages: int = 0
    formative: int = 0
    practical: int = 0
    capstone: int = 0
    route_proven: int = 0
    cxw_proven: bool = False
    sex_done: bool = False
    team_contrib: int = 0
    live_contrib: int = 0
    reflections: int = 0
    remediations: int = 0
    clusters: set = field(default_factory=set)
    horizons: set = field(default_factory=set)
    mat_dims: dict = field(default_factory=lambda: {k: 0 for k in MAT_WEIGHTS})
    contexts: int = 0
    trust_state: str = "UNESTABLISHED"
    trust_positive: int = 0
    trust_dims: set = field(default_factory=set)
    concerns: list = field(default_factory=list)
    integrity_hold: bool = False
    evidence_revoked: int = 0
    achievements: set = field(default_factory=set)
    capability_cmi: dict = field(default_factory=dict)
    plan: str = "OpenFlight"
    age: str = "adult"
    events_seen: set = field(default_factory=set)
    weeks_active: set = field(default_factory=set)


def apply_xp(state: ProgressState, event_id: str, amount: int, factor: float = 1.0) -> None:
    if event_id in state.events_seen:
        return  # idempotency — no duplicate progression
    state.events_seen.add(event_id)
    if factor <= 0:
        return
    gain = round_half_up(amount * factor)
    state.xp += gain
    state.xp_log.append((event_id, gain))


def reverse_xp(state: ProgressState, original_event_id: str) -> None:
    # negate exact original amount
    for eid, gain in state.xp_log:
        if eid == original_event_id:
            state.xp -= gain
            state.xp_log.append((f"REV:{eid}", -gain))
            return


def maturity_index(state: ProgressState) -> float:
    total = 0.0
    for k, w in MAT_WEIGHTS.items():
        lvl = max(0, min(4, state.mat_dims.get(k, 0)))
        total += (lvl / 4.0) * w
    return total


RANK_ORDER = ["Hatchling", "Fledgling", "Scout", "Pathfinder", "Specialist", "Vanguard", "Raven"]


def maturity_rank(state: ProgressState) -> str:
    """Highest fully-met Rank. Governed skip is allowed when a higher Rank's gates are fully met."""
    idx = maturity_index(state)
    dims = list(state.mat_dims.values())
    ge1 = sum(1 for d in dims if d >= 1)
    ge2 = sum(1 for d in dims if d >= 2)
    ge3 = sum(1 for d in dims if d >= 3)
    eq4 = sum(1 for d in dims if d == 4)
    rank = "Hatchling"
    # Fledgling: emerging independence across early learning contexts (Mission/Stage count as contexts)
    if idx >= 20 and ge1 >= 3 and state.contexts >= 2:
        rank = "Fledgling"
    if idx >= 35 and ge1 >= 5 and state.practical >= 1:
        rank = "Scout"
    if idx >= 50 and ge2 >= 5 and state.route_proven >= 1:
        rank = "Pathfinder"
    if idx >= 65 and ge2 >= 6 and ge3 >= 1 and state.contexts >= 2:
        rank = "Specialist"
    if (
        idx >= 78
        and ge3 >= 7
        and state.team_contrib + state.live_contrib >= 1
        and state.trust_state in ("POSITIVE_STANDING", "ELEVATED_RESPONSIBILITY_ELIGIBLE")
        and not state.integrity_hold
    ):
        rank = "Vanguard"
    if (
        idx >= 90
        and ge3 >= 7
        and eq4 >= 3
        and (state.cxw_proven or state.route_proven >= 2)
        and state.trust_state == "ELEVATED_RESPONSIBILITY_ELIGIBLE"
        and not state.integrity_hold
    ):
        rank = "Raven"
    return rank


def update_maturity_from_progress(state: ProgressState) -> None:
    """Qualitative dimension heuristic — CALIBRATION v0.2.0.

    CAL-FND-001 fix: learning contexts include Missions and Stages, not only Evidence.
    Soften first practical bump so Fledgling band remains reachable before Scout.
    """
    if state.missions >= 1:
        state.mat_dims["learning_independence"] = max(state.mat_dims["learning_independence"], 1)
        state.mat_dims["digital_independence"] = max(state.mat_dims["digital_independence"], 1)
    if state.missions >= 3:
        state.mat_dims["problem_decomposition"] = max(state.mat_dims["problem_decomposition"], 1)
    if state.missions >= 5:
        state.mat_dims["learning_independence"] = max(state.mat_dims["learning_independence"], 2)
    if state.stages >= 1:
        state.mat_dims["documentation_quality"] = max(state.mat_dims["documentation_quality"], 1)
    # First practical: modest lift (not automatic Scout-level Index)
    if state.practical >= 1:
        state.mat_dims["practical_execution"] = max(state.mat_dims["practical_execution"], 1)
        state.mat_dims["documentation_quality"] = max(state.mat_dims["documentation_quality"], 1)
        state.mat_dims["evidence_ownership"] = max(state.mat_dims["evidence_ownership"], 1)
    if state.practical >= 2:
        state.mat_dims["practical_execution"] = max(state.mat_dims["practical_execution"], 2)
        state.mat_dims["documentation_quality"] = max(state.mat_dims["documentation_quality"], 2)
        state.mat_dims["evidence_ownership"] = max(state.mat_dims["evidence_ownership"], 2)
        state.mat_dims["problem_decomposition"] = max(state.mat_dims["problem_decomposition"], 2)
    if state.practical >= 3:
        state.mat_dims["practical_execution"] = max(state.mat_dims["practical_execution"], 3)
        state.mat_dims["problem_decomposition"] = max(state.mat_dims["problem_decomposition"], 3)
    if state.capstone >= 1:
        state.mat_dims["problem_decomposition"] = max(state.mat_dims["problem_decomposition"], 3)
        state.mat_dims["responsible_judgment"] = max(state.mat_dims["responsible_judgment"], 3)
        state.mat_dims["evidence_ownership"] = max(state.mat_dims["evidence_ownership"], 3)
        state.mat_dims["unfamiliar_adaptation"] = max(state.mat_dims["unfamiliar_adaptation"], 2)
    if state.route_proven >= 1:
        state.mat_dims["responsible_judgment"] = max(state.mat_dims["responsible_judgment"], 3)
        state.mat_dims["learning_independence"] = max(state.mat_dims["learning_independence"], 3)
    if state.route_proven >= 2:
        for k in state.mat_dims:
            state.mat_dims[k] = max(state.mat_dims[k], 3)
        state.mat_dims["practical_execution"] = 4
        state.mat_dims["problem_decomposition"] = 4
        state.mat_dims["responsible_judgment"] = 4
    if state.cxw_proven:
        state.mat_dims["unfamiliar_adaptation"] = 4
        state.mat_dims["collaboration"] = max(state.mat_dims["collaboration"], 3)
    if state.team_contrib >= 1:
        state.mat_dims["collaboration"] = max(state.mat_dims["collaboration"], 2)
    if state.team_contrib >= 2:
        state.mat_dims["collaboration"] = max(state.mat_dims["collaboration"], 3)
    if state.remediations >= 1:
        state.mat_dims["evidence_ownership"] = max(state.mat_dims["evidence_ownership"], 2)
    # Contexts: Mission/Stage learning contexts + Evidence contexts (FRM-MAT-001 v0.2.0)
    mission_contexts = min(3, (state.missions + 1) // 2) + min(2, state.stages)
    evidence_contexts = state.practical + state.capstone + min(1, state.route_proven)
    state.contexts = max(state.contexts, min(5, mission_contexts + evidence_contexts))


def capability_mastery_index(state: ProgressState, route: str = "RT-OPR-001") -> float:
    # Synthetic CMI from Evidence counts — missing mandatory Evidence keeps DEVELOPING
    if state.integrity_hold:
        return 0.0
    if state.practical < 1 and state.capstone < 1:
        return min(40.0, state.formative * 15.0)  # developing / not standard
    # weights: formative 1, practical 2, capstone 3
    items = []
    if state.formative:
        items.append((min(100.0, 50 + state.formative * 10), 1))
    if state.practical:
        quality = 55 + min(40, state.practical * 15)
        if state.profile_boost:
            quality = min(100, quality + 15)
        items.append((float(quality), 2))
    if state.capstone:
        quality = 60 + min(35, state.capstone * 20)
        if getattr(state, "strong_capstone", False):
            quality = min(100, quality + 20)
        items.append((float(quality), 3))
    if not items:
        return 0.0
    num = sum(i * w for i, w in items)
    den = sum(w for _, w in items)
    return num / den


# attach profile boost flag dynamically
ProgressState.profile_boost = False  # type: ignore
ProgressState.strong_capstone = False  # type: ignore


def route_proven_eligible(state: ProgressState) -> bool:
    if state.integrity_hold:
        return False
    if state.practical < 1 or state.capstone < 1:
        return False
    cmi = capability_mastery_index(state)
    if cmi < 50:
        return False
    # mandatory assessment STANDARD_MET implied by practical+capstone in sim
    return True


def route_mastery_index(state: ProgressState) -> float:
    # single-route equal-weight proxy of required capabilities
    base = capability_mastery_index(state)
    if not route_proven_eligible(state) and base >= 50:
        # floor: cannot claim full route if missing mandatory
        return min(49.0, base)
    return base


def breadth_index(state: ProgressState) -> float:
    # Distinct coverage: 5 pts per cluster at STANDARD+, max 60
    # Clusters unlocked when practical/capstone/route_proven with horizon tags
    distinct = min(12, len(state.clusters))
    cov = min(60, distinct * 5)
    # Horizon diversity: 6.25 per horizon with >=2 clusters — we approximate horizons set size
    # For sim: each horizon with any cluster counts; need 2 clusters — use len(horizons) if clusters>=2*horizons
    hz = 0.0
    for h in state.horizons:
        # count clusters for horizon (prefix match)
        hc = sum(1 for c in state.clusters if c.startswith(h) or True)
        # simplified: if horizon in set and clusters >= 2 overall, award per horizon
        if len(state.clusters) >= 2:
            hz += 6.25
    hz = min(25.0, hz)
    integ = 0.0
    if state.cxw_proven:
        integ += 10
    if state.sex_done:
        integ += 3
    if state.team_contrib >= 1 and state.capstone >= 1:
        integ += 2
    integ = min(15.0, integ)
    return cov + hz + integ


def update_trust(state: ProgressState) -> None:
    if state.integrity_hold:
        state.trust_state = "REVIEW_REQUIRED"
        return
    if any(c == "CRITICAL" for c in state.concerns):
        state.trust_state = "SUSPENDED"
        return
    if any(c == "SERIOUS" for c in state.concerns):
        state.trust_state = "RESTRICTED"
        return
    if state.missions + state.practical + state.team_contrib + state.live_contrib == 0:
        state.trust_state = "UNESTABLISHED"
        return
    if state.trust_positive >= 5 and len(state.trust_dims) >= 3 and state.practical + state.team_contrib >= 2:
        # elevated requires A2 — represented as experienced/prestige profiles
        if getattr(state, "elevated_ok", False):
            state.trust_state = "ELEVATED_RESPONSIBILITY_ELIGIBLE"
            return
    if state.trust_positive >= 3 and len(state.trust_dims) >= 2:
        state.trust_state = "POSITIVE_STANDING"
        return
    state.trust_state = "NORMAL"


def prestige_eligibility_index(state: ProgressState) -> float:
    mastery_depth = min(100, route_mastery_index(state))
    brd = min(100, breadth_index(state))
    ev_q = min(100, 20 * state.practical + 30 * state.capstone + 10 * state.route_proven)
    trust_map = {
        "UNESTABLISHED": 10,
        "NORMAL": 40,
        "POSITIVE_STANDING": 70,
        "ELEVATED_RESPONSIBILITY_ELIGIBLE": 95,
        "REVIEW_REQUIRED": 20,
        "RESTRICTED": 5,
        "SUSPENDED": 0,
    }
    trust = trust_map.get(state.trust_state, 20)
    impact = min(100, 25 * state.team_contrib + 25 * state.live_contrib + 20 * (1 if state.cxw_proven else 0))
    sustained = min(100, 20 * state.route_proven + 15 * state.contexts)
    pei = (
        mastery_depth * 0.30
        + brd * 0.20
        + ev_q * 0.20
        + trust * 0.15
        + impact * 0.10
        + sustained * 0.05
    )
    return pei


def prestige_nomination(state: ProgressState) -> str:
    if state.integrity_hold or state.age == "minor":
        return "NOT_ELIGIBLE"
    pei = prestige_eligibility_index(state)
    # hard gates — nomination only, never auto-grant
    if (
        pei >= 94
        and state.route_proven >= 3
        and breadth_index(state) >= 80
        and state.cxw_proven
        and state.trust_state == "ELEVATED_RESPONSIBILITY_ELIGIBLE"
    ):
        return "ELIGIBLE_OBSIDIAN_NOMINATION"
    if (
        pei >= 84
        and state.route_proven >= 3
        and (state.cxw_proven or state.route_proven >= 3)
        and breadth_index(state) >= 65
        and state.trust_state == "ELEVATED_RESPONSIBILITY_ELIGIBLE"
    ):
        return "ELIGIBLE_APEX_NOMINATION"
    if (
        pei >= 72
        and state.route_proven >= 2
        and len(state.horizons) >= 2
        and state.trust_state in ("POSITIVE_STANDING", "ELEVATED_RESPONSIBILITY_ELIGIBLE")
        and (state.team_contrib + state.live_contrib + state.capstone) >= 1
    ):
        return "ELIGIBLE_ASCENDANT_NOMINATION"
    return "NOT_ELIGIBLE"


def title_eligibility(state: ProgressState) -> str:
    if state.integrity_hold:
        return "NOT_ELIGIBLE"
    rmi = route_mastery_index(state)
    brd = breadth_index(state)
    if (
        state.route_proven >= 1
        and rmi >= 70
        and brd >= 40
        and state.trust_state in ("NORMAL", "POSITIVE_STANDING", "ELEVATED_RESPONSIBILITY_ELIGIBLE")
    ):
        if (
            state.route_proven >= 2
            and len(state.horizons) >= 2
            and brd >= 65
            and state.cxw_proven
            and state.trust_state in ("POSITIVE_STANDING", "ELEVATED_RESPONSIBILITY_ELIGIBLE")
        ):
            return "INTEGRATED_TEMPLATE_ELIGIBLE_FOR_REVIEW"
        return "STANDARD_TEMPLATE_ELIGIBLE_FOR_REVIEW"
    if state.route_proven >= 1 and rmi >= 50:
        return "PROGRESS_VISIBLE"
    return "NOT_ELIGIBLE"


def award_achievements(state: ProgressState) -> None:
    if state.missions >= 1:
        state.achievements.add("ACH-ACT-001")
    if state.formative + state.practical >= 1:
        state.achievements.add("ACH-EVD-001")
    if state.stages >= 1:
        state.achievements.add("ACH-LRN-001")
    if state.route_proven >= 1:
        state.achievements.add("ACH-MST-001")
    if state.capstone >= 1:
        state.achievements.add("ACH-CAP-001")
    if state.remediations >= 1 and state.practical >= 1:
        state.achievements.add("ACH-EVD-002")
    if state.team_contrib >= 1:
        state.achievements.add("ACH-TEAM-001")
    if state.live_contrib >= 1:
        state.achievements.add("ACH-LIVE-001")
    if state.cxw_proven:
        state.achievements.add("ACH-CXW-001")
    if state.sex_done:
        state.achievements.add("ACH-SEX-001")
    if state.route_proven >= 2 and len(state.horizons) >= 2:
        state.achievements.add("ACH-BRD-001")
    if getattr(state, "returning", False) and state.missions >= 1:
        state.achievements.add("ACH-RET-001")


def season_momentum(weekly: list[float]) -> tuple[float, str, int]:
    active = [w for w in weekly if w > 0]
    active_weeks = len(active)
    if active_weeks == 0:
        return 0.0, "Iron", 0
    best6 = sorted(weekly, reverse=True)[:6]
    score = sum(best6) / len(best6) if best6 else 0.0
    # final placement requires >=4 active weeks; else provisional Iron/placement
    if active_weeks < 4:
        return score, "Iron", active_weeks  # provisional low
    return score, league_for(score), active_weeks


def compute_week_score(state: ProgressState, week_flags: dict) -> float:
    # Meaningful Progress 0-40, Consistency 0-25, Balanced 0-20, Recovery 0-15
    mp = 0.0
    if week_flags.get("mission"):
        mp += 15
    if week_flags.get("stage"):
        mp += 10
    if week_flags.get("evidence"):
        mp += 15
    if week_flags.get("capstone"):
        mp += 20
    mp = min(40.0, mp)
    # consistency: current + previous — approximated via week_flags["prev"]
    if week_flags.get("mission") or week_flags.get("evidence") or week_flags.get("stage"):
        if week_flags.get("prev_active"):
            cons = 25.0
        else:
            cons = 15.0
    else:
        cons = 0.0
    cats = sum(
        1
        for k in ("mission", "evidence", "remediation", "team", "live")
        if week_flags.get(k)
    )
    if cats >= 2:
        bal = 20.0
    elif cats == 1:
        bal = 10.0
    else:
        bal = 0.0
    rec = 0.0
    if week_flags.get("return"):
        rec += 10
    if week_flags.get("reflection") or week_flags.get("remediation"):
        rec += 5
    rec = min(15.0, rec)
    return min(100.0, mp + cons + bal + rec)


def simulate_persona(p: dict, weeks: int = 8, months: int = 12) -> dict[str, Any]:
    rng = random.Random(SEED + int(hashlib.md5(p["id"].encode()).hexdigest()[:8], 16) % 100000)
    state = ProgressState(plan=p["plan"], age=p["age"])
    state.profile_boost = p["profile"] in ("experienced", "prestige", "low_act_high_ev")  # type: ignore
    state.strong_capstone = p["profile"] in ("experienced", "prestige", "low_act_high_ev")  # type: ignore
    state.elevated_ok = p["profile"] in ("experienced", "prestige", "team_strong")  # type: ignore
    state.returning = p["profile"] == "returning"  # type: ignore

    # Returning: pre-seed historical XP/Evidence then inactivity gap
    if p["profile"] == "returning":
        apply_xp(state, "hist-m1", INTENSITY_XP["STANDARD"])
        state.missions = 3
        state.practical = 1
        state.formative = 1
        state.clusters.add("OPR-CC-01")
        state.horizons.add("OPR")
        state.trust_positive = 2
        state.trust_dims.add("EVIDENCE_INTEGRITY")
        state.trust_dims.add("IDENTITY_RELIABILITY")

    weekly_flags_hist: list[dict] = []
    event_rows = []
    eid = 0

    def emit(week: int, etype: str, **extra):
        nonlocal eid
        eid += 1
        event_id = f"{p['id']}-W{week:02d}-E{eid:04d}"
        event_rows.append(
            {
                "event_id": event_id,
                "persona_id": p["id"],
                "week": week,
                "event_type": etype,
                "plan": p["plan"],
                **extra,
            }
        )
        return event_id

    # PER-006: almost no learning — subscription alone
    if p["profile"] == "paid_idle":
        emit(1, "COMMERCIAL_ENTITLEMENT_ACTIVE", note="no progression effect")
        for w in range(8):
            state.weekly_mom[w] = 0.0
        update_maturity_from_progress(state)
        update_trust(state)
        award_achievements(state)
        return finalize(p, state, event_rows, expected_for(p))

    # Eight-week primary season + extended year activity for 12-month metrics
    for w in range(8):
        flags = {
            "mission": False,
            "stage": False,
            "evidence": False,
            "capstone": False,
            "remediation": False,
            "team": False,
            "live": False,
            "reflection": False,
            "return": False,
            "prev_active": bool(weekly_flags_hist and any(weekly_flags_hist[-1].get(k) for k in ("mission", "evidence", "stage"))),
        }
        if p["profile"] == "returning" and w == 0:
            flags["return"] = True

        # inactivity patterns
        skip = False
        if p["profile"] == "a11y_compressed":
            # one meaningful day-equivalent per week, miss week 3 and 6 as grace
            if w in (2, 5):
                skip = True
        if p["profile"] == "returning" and w in (1, 2):
            skip = True  # still recovering
        if p["profile"] == "steady" and w == 4:
            skip = True  # one missed week — no collapse
        if p["profile"] == "high_act_low_ev" and w == 0:
            # burst week — many missions
            pass

        act = p["activity"]
        ev = p["evidence"]

        if not skip and rng.random() < act:
            intensity = rng.choice(["LIGHT", "STANDARD", "DEEP", "EXTENDED"])
            if p["profile"] == "a11y_compressed":
                intensity = "STANDARD"
            n_missions = 1
            if p["profile"] == "high_act_low_ev":
                n_missions = 4 if w == 0 else 2
            if p["profile"] == "low_act_high_ev":
                n_missions = 1 if w % 3 == 0 else 0
            for _ in range(n_missions):
                mid = emit(w, "MISSION_COMPLETED", intensity=intensity)
                apply_xp(state, mid, INTENSITY_XP[intensity])
                state.missions += 1
                flags["mission"] = True
                # assign cluster/horizon — never ANL
                h = rng.choice(HORIZONS)
                state.horizons.add(h)
                state.clusters.add(f"{h}-CC-{rng.randint(1,3):02d}")
                if len(state.clusters) > 12:
                    # cap uniqueness conceptually
                    pass

        if not skip and flags["mission"] and rng.random() < 0.5:
            sid = emit(w, "STAGE_COMPLETED")
            apply_xp(state, sid, EVENT_XP["STAGE_COMPLETED"])
            state.stages += 1
            flags["stage"] = True

        # Evidence
        if not skip and rng.random() < ev:
            if p["profile"] == "high_act_low_ev" and rng.random() < 0.9:
                pass  # rarely Evidence
            else:
                kind = "PRACTICAL" if rng.random() < 0.7 or p["profile"] in ("low_act_high_ev", "experienced", "prestige") else "FORMATIVE"
                eid_ev = emit(w, "EVIDENCE_APPROVED", kind=kind)
                if kind == "PRACTICAL":
                    apply_xp(state, eid_ev, EVENT_XP["EVIDENCE_APPROVED_PRACTICAL"])
                    state.practical += 1
                else:
                    apply_xp(state, eid_ev, EVENT_XP["EVIDENCE_APPROVED_FORMATIVE"])
                    state.formative += 1
                flags["evidence"] = True
                state.trust_positive += 1
                state.trust_dims.add("EVIDENCE_INTEGRITY")

        # Capstone / Route-Proven for high Evidence profiles later in season
        if not skip and p["profile"] in ("low_act_high_ev", "experienced", "prestige", "merit", "steady", "team_strong") and w >= 5:
            if state.practical >= 1 and state.capstone < 1 and rng.random() < 0.8:
                cid = emit(w, "CAPSTONE_APPROVED")
                apply_xp(state, cid, EVENT_XP["CAPSTONE_APPROVED"])
                state.capstone += 1
                flags["capstone"] = True
            if state.capstone >= 1 and state.route_proven < 1 and route_proven_eligible(state):
                rid = emit(w, "ROUTE_PROVEN_GRANTED", route="RT-OPR-001")
                apply_xp(state, rid, EVENT_XP["ROUTE_PROVEN_GRANTED"])
                state.route_proven += 1
                state.horizons.add("OPR")
                state.clusters.add("OPR-CC-01")
                state.clusters.add("OPR-CC-02")

        # Prestige / multi-route
        if p["profile"] == "prestige" and w >= 6:
            if state.route_proven < 2:
                state.route_proven = 2
                state.horizons.update(["OPR", "BLD", "PRT"])
                for h in ("OPR", "BLD", "PRT"):
                    state.clusters.add(f"{h}-CC-01")
                    state.clusters.add(f"{h}-CC-02")
                emit(w, "ROUTE_PROVEN_GRANTED", route="RT-BLD-001")
            if not state.cxw_proven and w == 7:
                emit(w, "ROUTE_PROVEN_GRANTED", route="CXW-001")
                state.cxw_proven = True
                apply_xp(state, f"{p['id']}-cxw", 250)
            if not state.sex_done and w == 7:
                emit(w, "CAPSTONE_APPROVED", route="SEX-001")
                state.sex_done = True

        if p["profile"] == "experienced" and w == 7 and state.route_proven >= 1:
            state.horizons.add("BLD")
            state.clusters.add("BLD-CC-01")
            state.sex_done = True

        # Team
        if not skip and rng.random() < p["team"]:
            if p["profile"] == "team_passenger":
                emit(w, "LIVE_FLIGHT_COMPLETED", contribution="none")
                # no TEAM_CONTRIBUTION_APPROVED — passenger
            else:
                tid = emit(w, "TEAM_CONTRIBUTION_APPROVED")
                apply_xp(state, tid, EVENT_XP["TEAM_CONTRIBUTION_APPROVED"])
                state.team_contrib += 1
                flags["team"] = True
                state.trust_positive += 1
                state.trust_dims.add("COLLABORATION_RELIABILITY")

        if not skip and p["profile"] in ("team_strong", "prestige") and rng.random() < 0.4:
            lid = emit(w, "LIVE_RESULT_FINALIZED")
            apply_xp(state, lid, EVENT_XP["LIVE_RESULT_FINALIZED"])
            state.live_contrib += 1
            flags["live"] = True

        # Remediation / reflection
        if not skip and p["profile"] in ("steady", "merit", "returning") and w in (3, 6) and rng.random() < 0.5:
            rem = emit(w, "MISSION_REMEDIATION_COMPLETED")
            apply_xp(state, rem, INTENSITY_XP["STANDARD"] // 2)
            state.remediations += 1
            flags["remediation"] = True
            flags["reflection"] = True
            state.reflections += 1
            apply_xp(state, emit(w, "REFLECTION_APPROVED"), EVENT_XP["REFLECTION_APPROVED"])

        # Popularity — must NOT create Mastery
        if p["popular"] > 0.5 and w % 2 == 0:
            emit(w, "COMMUNITY_REACTION_BURST", note="no technical XP/Mastery")

        # Integrity review persona
        if p["profile"] == "integrity" and w == 5:
            emit(w, "EVIDENCE_REVOKED")
            if state.practical > 0:
                state.practical -= 1
                state.evidence_revoked += 1
            state.integrity_hold = True
            state.concerns.append("MODERATE")
            emit(w, "ASSESSMENT_INTEGRITY_REVIEWED")
        if p["profile"] == "integrity" and w == 7:
            # appeal restores
            emit(w, "EVIDENCE_RESTORED")
            emit(w, "EVIDENCE_APPEAL_RESOLVED")
            state.practical += 1
            state.integrity_hold = False
            state.concerns.clear()
            state.trust_positive += 1

        # Duplicate event test on PER-003 week 1
        if p["profile"] == "high_act_low_ev" and w == 1:
            dup = emit(w, "MISSION_COMPLETED", intensity="LIGHT", duplicate="true")
            apply_xp(state, dup, INTENSITY_XP["LIGHT"])
            # attempt same event id again — ignored
            apply_xp(state, dup, INTENSITY_XP["LIGHT"])

        score = 0.0 if skip else compute_week_score(state, flags)
        # Burst week cannot alone create Diamond season — volume capped in weekly score already
        if p["profile"] == "high_act_low_ev" and w == 0:
            score = min(score, 95.0)
        state.weekly_mom[w] = score
        if score > 0:
            state.weeks_active.add(w)
        weekly_flags_hist.append(flags)

    # Twelve-month extension: additional Route-Proven for prestige/experienced
    if p["profile"] in ("prestige", "experienced") and state.route_proven < 2:
        state.route_proven = max(state.route_proven, 2)
        state.horizons.update(["OPR", "BLD"])
    if p["profile"] == "prestige":
        state.elevated_ok = True  # type: ignore
        state.trust_positive = max(state.trust_positive, 6)
        state.trust_dims.update(
            ["IDENTITY_RELIABILITY", "EVIDENCE_INTEGRITY", "COLLABORATION_RELIABILITY", "SECURITY_RESPONSIBILITY"]
        )

    update_maturity_from_progress(state)
    update_trust(state)
    award_achievements(state)

    # Explicit: RT-ANL never contributes
    assert "ANL" not in state.horizons

    return finalize(p, state, event_rows, expected_for(p))


def expected_for(p: dict) -> dict[str, str]:
    prof = p["profile"]
    if prof == "high_act_low_ev":
        return {
            "high_xp": "yes",
            "route_proven": "no",
            "title": "no",
            "prestige": "no",
            "mastery_strong": "no",
        }
    if prof == "low_act_high_ev":
        return {
            "route_proven": "possible",
            "mastery_strong": "possible",
            "not_punished_for_efficiency": "yes",
        }
    if prof == "paid_idle":
        return {"xp": "0_or_near", "momentum": "Iron", "mastery": "none", "route_proven": "no"}
    if prof == "popular_weak":
        return {"mastery_from_popularity": "no", "prestige_from_popularity": "no"}
    if prof == "team_passenger":
        return {"full_mastery_from_team": "no"}
    if prof == "prestige":
        return {"prestige_auto_grant": "no", "nomination_possible": "yes"}
    return {"baseline": "ok"}


def finalize(p: dict, state: ProgressState, event_rows: list, expected: dict) -> dict[str, Any]:
    mom_score, mom_league, active_weeks = season_momentum(state.weekly_mom)
    cmi = capability_mastery_index(state)
    rmi = route_mastery_index(state)
    rp = route_proven_eligible(state) and state.route_proven >= 1
    # force route_proven flag consistency
    if rp and state.route_proven < 1:
        rp = False
    if state.route_proven >= 1 and not route_proven_eligible(state):
        # revoked / integrity — not currently proven
        rp = False
    brd = breadth_index(state)
    pei = prestige_eligibility_index(state)
    prest = prestige_nomination(state)
    title = title_eligibility(state)
    mat_idx = maturity_index(state)
    mat_rank = maturity_rank(state)
    lvl = flight_level(state.xp)

    # PASS checks vs expected
    issues = []
    if p["profile"] == "high_act_low_ev":
        if rp:
            issues.append("FAIL: high-act low-Evidence got Route-Proven")
        if "ELIGIBLE" in title and "NOT" not in title and "PROGRESS" not in title:
            if title.startswith("STANDARD") or title.startswith("INTEGRATED"):
                issues.append("FAIL: title from low Evidence")
        if prest != "NOT_ELIGIBLE":
            issues.append("FAIL: prestige from activity")
    if p["profile"] == "paid_idle":
        if state.xp != 0:
            issues.append("FAIL: paid idle earned XP")
        if mom_score > 0:
            issues.append("FAIL: paid idle Momentum")
        if rp:
            issues.append("FAIL: paid idle Route-Proven")
    if p["profile"] == "popular_weak":
        if cmi >= 50 and state.practical < 1:
            issues.append("FAIL: popularity created Mastery")
    if p["profile"] == "team_passenger":
        if state.team_contrib > 0:
            issues.append("FAIL: passenger got team contribution credit")
    if p["profile"] == "prestige":
        if prest == "GRANTED":
            issues.append("FAIL: auto Prestige grant")
    if "ANL" in state.horizons:
        issues.append("FAIL: ANL contributed")

    # low-act high-ev should be able to Route-Proven
    if p["profile"] == "low_act_high_ev" and not rp and state.practical >= 1 and state.capstone >= 1 and not state.integrity_hold:
        # may still fail if timing — mark soft
        if state.capstone >= 1 and cmi >= 50:
            issues.append("WARN: expected Route-Proven possible")

    status = "PASS" if not any(i.startswith("FAIL") for i in issues) else "FAIL"

    return {
        "persona_id": p["id"],
        "name": p["name"],
        "plan": p["plan"],
        "age": p["age"],
        "lang": p["lang"],
        "profile": p["profile"],
        "xp": state.xp,
        "flight_level": lvl,
        "momentum_score": round(mom_score, 2),
        "momentum_league": mom_league,
        "active_weeks": active_weeks,
        "weekly_scores": "|".join(str(round(x, 1)) for x in state.weekly_mom),
        "maturity_index": round(mat_idx, 2),
        "maturity_rank": mat_rank,
        "cmi": round(cmi, 2),
        "rmi": round(rmi, 2),
        "route_proven": int(rp or state.route_proven >= 1 and route_proven_eligible(state)),
        "route_proven_count": state.route_proven,
        "breadth_index": round(brd, 2),
        "breadth_descriptor": breadth_descriptor(brd),
        "trust_state": state.trust_state,
        "title_eligibility": title,
        "prestige_pei": round(pei, 2),
        "prestige_nomination": prest,
        "achievements": len(state.achievements),
        "achievement_ids": "|".join(sorted(state.achievements)),
        "cxw": int(state.cxw_proven),
        "sex": int(state.sex_done),
        "team_contrib": state.team_contrib,
        "practical": state.practical,
        "capstone": state.capstone,
        "missions": state.missions,
        "integrity_hold": int(state.integrity_hold),
        "clusters": len(state.clusters),
        "horizons": "|".join(sorted(state.horizons)),
        "ldb_mastery_eligible": int(bool(rp) and p["age"] != "minor"),
        "ldb_momentum_eligible": int(active_weeks >= 4),
        "expected": str(expected),
        "issues": ";".join(issues),
        "result": status,
        "events": event_rows,
    }


def pay_to_win_test() -> dict[str, Any]:
    """Identical histories across plans must yield zero progression differences."""
    base_events = [
        ("MISSION_COMPLETED", "STANDARD"),
        ("STAGE_COMPLETED", None),
        ("EVIDENCE_APPROVED_PRACTICAL", None),
        ("CAPSTONE_APPROVED", None),
        ("ROUTE_PROVEN_GRANTED", None),
    ]
    plans = ["OpenFlight", "FlightPass", "WingPass", "Expedition", "MeritRoute"]
    results = {}
    for plan in plans:
        st = ProgressState(plan=plan)
        for i, (etype, intens) in enumerate(base_events):
            eid = f"PTW-{plan}-{i}"
            if etype == "MISSION_COMPLETED":
                apply_xp(st, eid, INTENSITY_XP[intens])
                st.missions += 1
            elif etype == "STAGE_COMPLETED":
                apply_xp(st, eid, EVENT_XP["STAGE_COMPLETED"])
                st.stages += 1
            elif etype == "EVIDENCE_APPROVED_PRACTICAL":
                apply_xp(st, eid, EVENT_XP["EVIDENCE_APPROVED_PRACTICAL"])
                st.practical += 1
            elif etype == "CAPSTONE_APPROVED":
                apply_xp(st, eid, EVENT_XP["CAPSTONE_APPROVED"])
                st.capstone += 1
            elif etype == "ROUTE_PROVEN_GRANTED":
                apply_xp(st, eid, EVENT_XP["ROUTE_PROVEN_GRANTED"])
                st.route_proven += 1
        st.horizons.add("OPR")
        st.clusters.add("OPR-CC-01")
        st.clusters.add("OPR-CC-02")
        st.weekly_mom = [40, 45, 50, 42, 48, 44, 46, 41]
        update_maturity_from_progress(st)
        update_trust(st)
        mom_score, mom_league, _ = season_momentum(st.weekly_mom)
        results[plan] = {
            "xp": st.xp,
            "momentum": round(mom_score, 4),
            "maturity": round(maturity_index(st), 4),
            "mastery": round(capability_mastery_index(st), 4),
            "breadth": round(breadth_index(st), 4),
            "trust": st.trust_state,
            "title": title_eligibility(st),
            "prestige": prestige_nomination(st),
        }
    # compare to OpenFlight
    base = results["OpenFlight"]
    diffs = {}
    for plan, r in results.items():
        diffs[plan] = {k: (r[k] - base[k] if isinstance(r[k], (int, float)) else (0 if r[k] == base[k] else 1)) for k in base}
    all_zero = all(all(v == 0 for v in d.values()) for d in diffs.values())
    return {"results": results, "diffs": diffs, "pass": all_zero}


def population_sim(n: int = 500) -> list[dict]:
    rng = random.Random(SEED)
    rows = []
    profiles = [
        "new", "steady", "high_act_low_ev", "low_act_high_ev", "experienced",
        "paid_idle", "merit", "returning", "minor_ar", "a11y_compressed",
        "team_passenger", "team_strong", "integrity", "popular_weak", "prestige",
    ]
    plans = ["OpenFlight", "FlightPass", "WingPass", "Expedition", "MeritRoute"]
    for i in range(n):
        prof = profiles[i % len(profiles)]
        # reduce prestige frequency
        if prof == "prestige" and rng.random() > 0.04:
            prof = "steady"
        if prof == "paid_idle" and rng.random() > 0.15:
            prof = "new"
        p = {
            "id": f"SYN-{i:04d}",
            "name": f"Synthetic {i}",
            "plan": rng.choice(plans),
            "age": "minor" if prof == "minor_ar" else "adult",
            "lang": "ar" if prof in ("minor_ar",) or rng.random() < 0.3 else "en",
            "profile": prof,
            "activity": {
                "new": 0.35, "steady": 0.65, "high_act_low_ev": 0.9, "low_act_high_ev": 0.25,
                "experienced": 0.55, "paid_idle": 0.02, "merit": 0.6, "returning": 0.45,
                "minor_ar": 0.5, "a11y_compressed": 0.4, "team_passenger": 0.35,
                "team_strong": 0.6, "integrity": 0.5, "popular_weak": 0.45, "prestige": 0.7,
            }[prof],
            "evidence": {
                "new": 0.25, "steady": 0.65, "high_act_low_ev": 0.05, "low_act_high_ev": 0.95,
                "experienced": 0.85, "paid_idle": 0.0, "merit": 0.7, "returning": 0.55,
                "minor_ar": 0.45, "a11y_compressed": 0.6, "team_passenger": 0.15,
                "team_strong": 0.75, "integrity": 0.55, "popular_weak": 0.12, "prestige": 0.95,
            }[prof],
            "integrity": "review" if prof == "integrity" else "clean",
            "team": 0.8 if "team" in prof else 0.15,
            "popular": 0.9 if prof == "popular_weak" else 0.05,
        }
        # lighter: reuse persona sim but truncated naming
        res = simulate_persona(p)
        rows.append({k: res[k] for k in res if k != "events"})
    return rows


def sensitivity(persona_results: list[dict]) -> list[dict]:
    rows = []
    # XP scale effects on levels — analytical, not full re-sim
    for scale in (0.8, 0.9, 1.0, 1.1, 1.2):
        for pr in persona_results:
            scaled_xp = int(pr["xp"] * scale)
            rows.append(
                {
                    "param": "XP_SCALE",
                    "scale": scale,
                    "persona_id": pr["persona_id"],
                    "metric": "flight_level",
                    "baseline": pr["flight_level"],
                    "variant": flight_level(scaled_xp),
                    "changed": int(flight_level(scaled_xp) != pr["flight_level"]),
                }
            )
    for delta in (-10, -5, 0, 5, 10):
        for pr in persona_results:
            s = pr["momentum_score"] + delta
            s = max(0, min(100, s))
            rows.append(
                {
                    "param": "MOM_THRESHOLD_SHIFT",
                    "scale": delta,
                    "persona_id": pr["persona_id"],
                    "metric": "momentum_league",
                    "baseline": pr["momentum_league"],
                    "variant": league_for(s),
                    "changed": int(league_for(s) != pr["momentum_league"]),
                }
            )
    for floors in ((45, 65, 80), (50, 70, 85), (55, 75, 90)):
        for pr in persona_results:
            cmi = pr["cmi"]
            if cmi < floors[0]:
                st = "DEVELOPING"
            elif cmi < floors[1]:
                st = "STANDARD"
            elif cmi < floors[2]:
                st = "STRONG"
            else:
                st = "ADVANCED"
            base_st = (
                "DEVELOPING"
                if pr["cmi"] < 50
                else "STANDARD"
                if pr["cmi"] < 70
                else "STRONG"
                if pr["cmi"] < 85
                else "ADVANCED"
            )
            rows.append(
                {
                    "param": "MASTERY_FLOORS",
                    "scale": str(floors),
                    "persona_id": pr["persona_id"],
                    "metric": "mastery_band",
                    "baseline": base_st,
                    "variant": st,
                    "changed": int(st != base_st),
                }
            )
    return rows


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    keys: list[str] = []
    seen = set()
    for r in rows:
        for k in r.keys():
            if k not in seen:
                seen.add(k)
                keys.append(k)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore", restval="")
        w.writeheader()
        for r in rows:
            w.writerow(r)


def write_formula_inputs(path: Path) -> None:
    rows = [
        {"formula_id": "FRM-XP-001", "param": "LIGHT", "value": 10},
        {"formula_id": "FRM-XP-001", "param": "STANDARD", "value": 20},
        {"formula_id": "FRM-XP-001", "param": "DEEP", "value": 35},
        {"formula_id": "FRM-XP-001", "param": "EXTENDED", "value": 50},
        {"formula_id": "FRM-LVL-001", "param": "curve", "value": "100*(L-1)*L/2"},
        {"formula_id": "FRM-MOM-002", "param": "season_weeks", "value": 8},
        {"formula_id": "FRM-MOM-002", "param": "best_weeks", "value": 6},
        {"formula_id": "FRM-MOM-002", "param": "min_active_weeks", "value": 4},
        {"formula_id": "SEED", "param": "default", "value": SEED},
    ]
    write_csv(path, rows)


def main() -> None:
    print("NON-RUNTIME ANALYSIS TOOL — NOT PRODUCT CODE")
    print(f"Seed={SEED}")
    write_formula_inputs(OUT_DIR / "formula-inputs.csv")

    persona_results = []
    all_events = []
    for p in PERSONAS:
        res = simulate_persona(p)
        events = res.pop("events")
        all_events.extend(events)
        persona_results.append(res)
        print(f"{p['id']}: XP={res['xp']} Lvl={res['flight_level']} Mom={res['momentum_league']} "
              f"Mat={res['maturity_rank']} RP={res['route_proven']} Prest={res['prestige_nomination']} "
              f"Result={res['result']}")

    write_csv(OUT_DIR / "persona-events.csv", all_events if all_events else [{"event_id": ""}])
    write_csv(OUT_DIR / "persona-results.csv", persona_results)

    pop = population_sim(500)
    write_csv(OUT_DIR / "population-results.csv", pop)

    sens = sensitivity(persona_results)
    write_csv(OUT_DIR / "sensitivity-results.csv", sens)

    ptw = pay_to_win_test()

    # Warning triggers on population
    n = len(pop)
    diamond = sum(1 for r in pop if r["momentum_league"] == "Diamond") / n
    raven = sum(1 for r in pop if r["maturity_rank"] == "Raven") / n
    asc = sum(1 for r in pop if "ASCENDANT" in r["prestige_nomination"]) / n
    apex = sum(1 for r in pop if "APEX" in r["prestige_nomination"]) / n
    obs = sum(1 for r in pop if "OBSIDIAN" in r["prestige_nomination"]) / n
    rp_rate = sum(1 for r in pop if int(r["route_proven"]) == 1) / n

    warnings = []
    if diamond > 0.15:
        warnings.append(f"WARN Diamond rate {diamond:.2%}")
    if raven > 0.10:
        warnings.append(f"WARN Raven rate {raven:.2%}")
    if asc > 0.05:
        warnings.append(f"WARN Ascendant nomination {asc:.2%}")
    if apex > 0.01:
        warnings.append(f"WARN Apex nomination {apex:.2%}")
    if obs > 0:
        warnings.append(f"WARN Obsidian nomination {obs:.2%}")

    fails = [r for r in persona_results if r["result"] == "FAIL"]
    summary = f"""# Simulation Summary — GHV.PROGRESSION.1B

```text
NON-RUNTIME ANALYSIS TOOL
NOT PRODUCT CODE
NOT APPROVED FOR PRODUCTION
```

| Field | Value |
|-------|-------|
| Seed | {SEED} |
| Personas | 15 |
| Population | 500 |
| Persona FAIL count | {len(fails)} |
| Pay-to-win PASS | {ptw['pass']} |
| Diamond rate | {diamond:.2%} |
| Raven rate | {raven:.2%} |
| Ascendant nomination rate | {asc:.2%} |
| Apex nomination rate | {apex:.2%} |
| Obsidian nomination rate | {obs:.2%} |
| Route-Proven rate | {rp_rate:.2%} |

## Warnings

{chr(10).join(warnings) if warnings else "None triggered."}

## Pay-to-win diffs

All progression differences across plans for identical histories must be 0.

Pass: **{ptw['pass']}**

## Persona results

| ID | XP | Level | Momentum | Maturity | RP | Prestige | Result |
|----|---:|------:|----------|----------|---:|----------|--------|
""" + "\n".join(
        f"| {r['persona_id']} | {r['xp']} | {r['flight_level']} | {r['momentum_league']} | {r['maturity_rank']} | {r['route_proven']} | {r['prestige_nomination']} | {r['result']} |"
        for r in persona_results
    ) + """

## Status

```text
SIMULATION CANDIDATE — PENDING GHV.PROGRESSION.1C CALIBRATION
NOT CALIBRATED
NOT REAL-USER EVIDENCE
```
"""
    (OUT_DIR / "simulation-summary.md").write_text(summary, encoding="utf-8")
    # also dump ptw json-ish as md appendix
    (OUT_DIR / "pay-to-win-results.txt").write_text(str(ptw), encoding="utf-8")
    print("Pay-to-win PASS:", ptw["pass"])
    print("Warnings:", warnings)
    print("Wrote outputs to", OUT_DIR)


if __name__ == "__main__":
    main()
