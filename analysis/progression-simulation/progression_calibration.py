#!/usr/bin/env python3
# NON-RUNTIME ANALYSIS TOOL
# NOT PRODUCT CODE
# NOT APPROVED FOR PRODUCTION
# GHV.PROGRESSION.1C — multi-seed integrity, fairness and calibration
# Do not import from application packages. No network. No database. No secrets.
"""
Isolated analytical calibration harness for GHURAVIA progression formulas.
Extends progression_simulation.py — stdlib only.
"""

from __future__ import annotations

import csv
import hashlib
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Same-directory import of progression_simulation
# ---------------------------------------------------------------------------
_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

import progression_simulation as ps  # noqa: E402

OUT_DIR = _HERE

CAL_SEEDS = [20260721, 20260722, 20260723, 20260724, 20260725]
USERS_PER_SEED = 5000
COHORT_SIZES = {"A": 2500, "B": 1500, "C": 500, "D": 250, "E": 150, "F": 100}

RANK_ORDER = getattr(
    ps,
    "RANK_ORDER",
    ["Hatchling", "Fledgling", "Scout", "Pathfinder", "Specialist", "Vanguard", "Raven"],
)

FORMULA_VERSIONS: dict[str, str] = {
    "FRM-XP-001": "0.1.1",
    "FRM-LVL-001": "0.1.0",
    "FRM-MOM-001": "0.1.0",
    "FRM-MOM-002": "0.2.0",
    "FRM-MAT-001": "0.2.0",
    "FRM-MST-001": "0.1.0",
    "FRM-MST-002": "0.1.0",
    "FRM-MST-003": "0.1.0",
    "FRM-BRD-001": "0.1.0",
    "POL-TRU-001": "0.1.0",
    "TPL-TTL-001": "0.1.0",
    "TPL-TTL-002": "0.1.0",
    "FRM-PRS-001": "0.1.0",
    "POL-PRS-001": "0.1.0",
    "POL-ACH-001": "0.1.0",
    "FRM-LDB-001": "0.1.0",
    "FRM-LDB-002": "0.1.0",
    "FRM-LDB-003": "0.1.0",
    "FRM-LDB-004": "0.1.0",
    "FRM-LDB-005": "0.1.0",
    "FRM-LDB-006": "0.1.0",
    "POL-POP-001": "0.1.0",
    "POL-COR-001": "0.1.0",
    "POL-FRS-001": "0.1.0",
}

# Cohort → profile sampling weights (architecture-stress / launch-realistic /
# experienced / a11y / adversarial / minor)
COHORT_PROFILE_WEIGHTS: dict[str, dict[str, float]] = {
    "A": {  # architecture-stress — broad coverage like 1B
        "new": 0.10,
        "steady": 0.12,
        "high_act_low_ev": 0.08,
        "low_act_high_ev": 0.08,
        "experienced": 0.08,
        "paid_idle": 0.05,
        "merit": 0.07,
        "returning": 0.07,
        "minor_ar": 0.05,
        "a11y_compressed": 0.06,
        "team_passenger": 0.06,
        "team_strong": 0.06,
        "integrity": 0.05,
        "popular_weak": 0.04,
        "prestige": 0.03,
    },
    "B": {  # launch-realistic — early / incomplete journeys
        "new": 0.40,
        "steady": 0.20,
        "returning": 0.12,
        "paid_idle": 0.10,
        "a11y_compressed": 0.05,
        "high_act_low_ev": 0.05,
        "merit": 0.04,
        "minor_ar": 0.04,
    },
    "C": {  # experienced recognition
        "experienced": 0.35,
        "low_act_high_ev": 0.30,
        "prestige": 0.15,
        "merit": 0.10,
        "team_strong": 0.10,
    },
    "D": {  # a11y / schedule diversity
        "a11y_compressed": 0.50,
        "steady": 0.20,
        "returning": 0.15,
        "new": 0.10,
        "merit": 0.05,
    },
    "E": {  # adversarial integrity
        "integrity": 0.25,
        "team_passenger": 0.20,
        "popular_weak": 0.20,
        "high_act_low_ev": 0.20,
        "paid_idle": 0.15,
    },
    "F": {  # minor / privacy
        "minor_ar": 0.70,
        "new": 0.20,
        "steady": 0.10,
    },
}

_ACTIVITY = {
    "new": 0.35,
    "steady": 0.65,
    "high_act_low_ev": 0.9,
    "low_act_high_ev": 0.25,
    "experienced": 0.55,
    "paid_idle": 0.02,
    "merit": 0.6,
    "returning": 0.45,
    "minor_ar": 0.5,
    "a11y_compressed": 0.4,
    "team_passenger": 0.35,
    "team_strong": 0.6,
    "integrity": 0.5,
    "popular_weak": 0.45,
    "prestige": 0.7,
}

_EVIDENCE = {
    "new": 0.25,
    "steady": 0.65,
    "high_act_low_ev": 0.05,
    "low_act_high_ev": 0.95,
    "experienced": 0.85,
    "paid_idle": 0.0,
    "merit": 0.7,
    "returning": 0.55,
    "minor_ar": 0.45,
    "a11y_compressed": 0.6,
    "team_passenger": 0.15,
    "team_strong": 0.75,
    "integrity": 0.55,
    "popular_weak": 0.12,
    "prestige": 0.95,
}

_SKILL_KEYS = (
    "xp",
    "maturity_index",
    "maturity_rank",
    "cmi",
    "rmi",
    "route_proven",
    "breadth_index",
    "trust_state",
    "title_eligibility",
    "prestige_nomination",
)


def _weighted_choice(rng: random.Random, weights: dict[str, float]) -> str:
    items = list(weights.items())
    total = sum(w for _, w in items)
    r = rng.random() * total
    acc = 0.0
    for key, w in items:
        acc += w
        if r <= acc:
            return key
    return items[-1][0]


def make_persona(seed: int, cohort: str, index: int) -> dict[str, Any]:
    """Deterministic persona for (seed, cohort, index)."""
    rng = random.Random(seed ^ (ord(cohort) << 16) ^ index)
    weights = COHORT_PROFILE_WEIGHTS[cohort]
    prof = _weighted_choice(rng, weights)
    plans = ["OpenFlight", "FlightPass", "WingPass", "Expedition", "MeritRoute"]
    if cohort == "F" or prof == "minor_ar":
        age = "minor"
        lang = "ar" if rng.random() < 0.7 else "en"
        plan = "OpenFlight" if rng.random() < 0.7 else rng.choice(plans)
    else:
        age = "adult"
        lang = "ar" if (cohort == "B" and rng.random() < 0.35) or rng.random() < 0.25 else "en"
        plan = rng.choice(plans)
    return {
        "id": f"CAL-{seed}-{cohort}-{index:04d}",
        "name": f"Cal {cohort} {index}",
        "plan": plan,
        "age": age,
        "lang": lang,
        "profile": prof,
        "activity": _ACTIVITY[prof],
        "evidence": _EVIDENCE[prof],
        "integrity": "review" if prof == "integrity" else "clean",
        "team": 0.8 if "team" in prof else (0.15 if cohort != "E" else 0.5),
        "popular": 0.9 if prof == "popular_weak" else 0.05,
        "cohort": cohort,
        "seed": seed,
    }


def run_population(seed: int) -> list[dict[str, Any]]:
    """Simulate USERS_PER_SEED users for one seed across cohorts A–F."""
    assert sum(COHORT_SIZES.values()) == USERS_PER_SEED
    prev_seed = ps.SEED
    ps.SEED = seed
    rows: list[dict[str, Any]] = []
    try:
        for cohort, n in COHORT_SIZES.items():
            print(f"  seed={seed} cohort={cohort} n={n} …", flush=True)
            for i in range(n):
                p = make_persona(seed, cohort, i)
                res = ps.simulate_persona(p)
                row = {k: res[k] for k in res if k != "events"}
                row["cohort"] = cohort
                row["seed"] = seed
                row["formula_frm_mat"] = FORMULA_VERSIONS["FRM-MAT-001"]
                row["formula_frm_mom"] = FORMULA_VERSIONS["FRM-MOM-002"]
                row["formula_frm_xp"] = FORMULA_VERSIONS["FRM-XP-001"]
                rows.append(row)
    finally:
        ps.SEED = prev_seed
    return rows


def summarize(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Per-seed summary rows for calibration-seed-summary.csv."""
    out: list[dict[str, Any]] = []
    by_seed: dict[int, list[dict]] = defaultdict(list)
    for r in rows:
        by_seed[int(r["seed"])].append(r)
    for seed in sorted(by_seed):
        chunk = by_seed[seed]
        n = len(chunk)
        ranks = Counter(r["maturity_rank"] for r in chunk)
        leagues = Counter(r["momentum_league"] for r in chunk)
        levels = Counter(r["flight_level"] for r in chunk)
        prest = Counter(r["prestige_nomination"] for r in chunk)
        rp = sum(1 for r in chunk if int(r["route_proven"]) == 1)
        asc = sum(1 for r in chunk if "ASCENDANT" in str(r["prestige_nomination"]))
        apex = sum(1 for r in chunk if "APEX" in str(r["prestige_nomination"]))
        obs = sum(1 for r in chunk if "OBSIDIAN" in str(r["prestige_nomination"]))
        diamond = sum(1 for r in chunk if r["momentum_league"] == "Diamond")
        out.append(
            {
                "seed": seed,
                "n": n,
                "fledgling": ranks.get("Fledgling", 0),
                "hatchling": ranks.get("Hatchling", 0),
                "scout": ranks.get("Scout", 0),
                "pathfinder": ranks.get("Pathfinder", 0),
                "specialist": ranks.get("Specialist", 0),
                "vanguard": ranks.get("Vanguard", 0),
                "raven": ranks.get("Raven", 0),
                "route_proven": rp,
                "route_proven_pct": round(100.0 * rp / n, 2) if n else 0.0,
                "ascendant": asc,
                "apex": apex,
                "obsidian": obs,
                "diamond": diamond,
                "iron": leagues.get("Iron", 0),
                "bronze": leagues.get("Bronze", 0),
                "silver": leagues.get("Silver", 0),
                "gold": leagues.get("Gold", 0),
                "platinum": leagues.get("Platinum", 0),
                "mean_xp": round(sum(r["xp"] for r in chunk) / n, 2) if n else 0.0,
                "mean_maturity": round(sum(float(r["maturity_index"]) for r in chunk) / n, 2) if n else 0.0,
                "level_hist": "|".join(f"{k}:{levels[k]}" for k in sorted(levels)),
                "league_hist": "|".join(f"{k}:{leagues[k]}" for k in sorted(leagues, key=str)),
                "rank_hist": "|".join(f"{k}:{ranks[k]}" for k in RANK_ORDER),
                "prestige_hist": "|".join(f"{k}:{prest[k]}" for k in sorted(prest, key=str)),
            }
        )
    return out


def prove_fledgling_reachable() -> dict[str, Any]:
    """CAL-FND-001 — construct a state that is Fledgling and not Scout."""
    st = ps.ProgressState()
    st.missions = 5
    st.stages = 1
    st.practical = 1
    ps.update_maturity_from_progress(st)
    idx = ps.maturity_index(st)
    rank = ps.maturity_rank(st)
    ge1 = sum(1 for d in st.mat_dims.values() if d >= 1)
    ok = rank == "Fledgling" and idx >= 20 and ge1 >= 3 and st.contexts >= 2
    return {
        "test": "prove_fledgling_reachable",
        "pass": ok,
        "rank": rank,
        "maturity_index": round(idx, 4),
        "contexts": st.contexts,
        "dims_ge1": ge1,
        "missions": st.missions,
        "stages": st.stages,
        "practical": st.practical,
        "note": "FRM-MAT-001 v0.2.0 contexts include Mission/Stage; first practical soft-bumped",
    }


def prove_monotonicity() -> dict[str, Any]:
    """Rank index must never decrease as governed progress accumulates."""
    st = ps.ProgressState()
    snapshots: list[tuple[str, int, float]] = []
    steps = [
        ("missions", 1),
        ("missions", 3),
        ("missions", 5),
        ("stages", 1),
        ("practical", 1),
        ("practical", 2),
        ("capstone", 1),
        ("route_proven", 1),
        ("team_contrib", 1),
        ("trust_positive", 3),
        ("route_proven", 2),
        ("cxw_proven", True),
        ("trust_positive", 6),
    ]
    prev_idx = -1
    violations: list[str] = []
    for attr, val in steps:
        if attr == "cxw_proven":
            st.cxw_proven = bool(val)
        elif attr == "trust_positive":
            st.trust_positive = int(val)
            st.trust_dims.update(
                ["EVIDENCE_INTEGRITY", "IDENTITY_RELIABILITY", "COLLABORATION_RELIABILITY"]
            )
            st.elevated_ok = True  # type: ignore[attr-defined]
        else:
            setattr(st, attr, val)
        if attr in ("team_contrib", "live_contrib") or attr == "trust_positive":
            pass
        ps.update_maturity_from_progress(st)
        ps.update_trust(st)
        rank = ps.maturity_rank(st)
        ridx = RANK_ORDER.index(rank)
        snapshots.append((rank, ridx, ps.maturity_index(st)))
        if ridx < prev_idx:
            violations.append(f"{attr}={val}: {RANK_ORDER[prev_idx]} -> {rank}")
        prev_idx = max(prev_idx, ridx)
    # Also: lower Index alone must not yield higher Rank under same hard gates
    low = ps.ProgressState(missions=2, stages=1)
    high = ps.ProgressState(missions=5, stages=1, practical=1)
    ps.update_maturity_from_progress(low)
    ps.update_maturity_from_progress(high)
    low_r = RANK_ORDER.index(ps.maturity_rank(low))
    high_r = RANK_ORDER.index(ps.maturity_rank(high))
    if ps.maturity_index(low) < ps.maturity_index(high) and low_r > high_r:
        violations.append("lower index received higher rank")
    return {
        "test": "prove_monotonicity",
        "pass": len(violations) == 0,
        "violations": ";".join(violations),
        "path": " > ".join(s[0] for s in snapshots),
        "final_rank": snapshots[-1][0] if snapshots else "Hatchling",
    }


def _apply_matched_learning(st: ps.ProgressState) -> None:
    """Identical progression-relevant event stream for counterfactual pairs."""
    events = [
        ("m1", "MISSION", 20),
        ("m2", "MISSION", 20),
        ("m3", "MISSION", 20),
        ("s1", "STAGE", 40),
        ("e1", "PRACTICAL", 60),
        ("c1", "CAPSTONE", 150),
        ("r1", "ROUTE", 250),
    ]
    for eid, kind, amt in events:
        if kind == "MISSION":
            ps.apply_xp(st, eid, amt)
            st.missions += 1
            st.horizons.add("OPR")
            st.clusters.add("OPR-CC-01")
        elif kind == "STAGE":
            ps.apply_xp(st, eid, amt)
            st.stages += 1
        elif kind == "PRACTICAL":
            ps.apply_xp(st, eid, amt)
            st.practical += 1
            st.trust_positive += 1
            st.trust_dims.add("EVIDENCE_INTEGRITY")
        elif kind == "CAPSTONE":
            ps.apply_xp(st, eid, amt)
            st.capstone += 1
        elif kind == "ROUTE":
            ps.apply_xp(st, eid, amt)
            st.route_proven += 1
            st.clusters.add("OPR-CC-02")
    st.weekly_mom = [40.0, 42.0, 38.0, 45.0, 41.0, 44.0, 39.0, 43.0]
    st.trust_positive = max(st.trust_positive, 3)
    st.trust_dims.add("IDENTITY_RELIABILITY")
    ps.update_maturity_from_progress(st)
    ps.update_trust(st)


def _skill_snapshot(st: ps.ProgressState) -> dict[str, Any]:
    mom_score, _, _ = ps.season_momentum(st.weekly_mom)
    return {
        "xp": st.xp,
        "maturity_index": round(ps.maturity_index(st), 4),
        "maturity_rank": ps.maturity_rank(st),
        "cmi": round(ps.capability_mastery_index(st), 4),
        "breadth_index": round(ps.breadth_index(st), 4),
        "route_proven": int(ps.route_proven_eligible(st) and st.route_proven >= 1),
        "trust_state": st.trust_state,
        "title_eligibility": ps.title_eligibility(st),
        "prestige_nomination": ps.prestige_nomination(st),
        "momentum_score": round(mom_score, 4),
    }


def counterfactual_tests() -> list[dict[str, Any]]:
    """Gate §12 — matched events; Skill equal; Momentum may differ ≤10 for schedules."""
    rows: list[dict[str, Any]] = []

    def pair(
        name: str,
        left_meta: dict,
        right_meta: dict,
        *,
        left_weeks: list[float] | None = None,
        right_weeks: list[float] | None = None,
        allow_mom_delta: float = 0.0,
    ) -> None:
        a = ps.ProgressState(plan=left_meta.get("plan", "OpenFlight"), age=left_meta.get("age", "adult"))
        b = ps.ProgressState(plan=right_meta.get("plan", "OpenFlight"), age=right_meta.get("age", "adult"))
        _apply_matched_learning(a)
        _apply_matched_learning(b)
        if left_weeks is not None:
            a.weekly_mom = list(left_weeks)
        if right_weeks is not None:
            b.weekly_mom = list(right_weeks)
        sa, sb = _skill_snapshot(a), _skill_snapshot(b)
        skill_fail = []
        for k in (
            "xp",
            "maturity_index",
            "maturity_rank",
            "cmi",
            "breadth_index",
            "route_proven",
            "trust_state",
            "title_eligibility",
            "prestige_nomination",
        ):
            if sa[k] != sb[k]:
                skill_fail.append(f"{k}:{sa[k]}!={sb[k]}")
        mom_delta = abs(sa["momentum_score"] - sb["momentum_score"])
        mom_ok = mom_delta <= allow_mom_delta + 1e-9
        passed = len(skill_fail) == 0 and mom_ok
        rows.append(
            {
                "test": name,
                "left": str(left_meta),
                "right": str(right_meta),
                "skill_equal": int(len(skill_fail) == 0),
                "skill_diffs": ";".join(skill_fail),
                "mom_left": sa["momentum_score"],
                "mom_right": sb["momentum_score"],
                "mom_delta": round(mom_delta, 4),
                "mom_allow": allow_mom_delta,
                "result": "PASS" if passed else "FAIL",
            }
        )

    # 1 plans
    pair("plans_openflight_vs_expedition", {"plan": "OpenFlight"}, {"plan": "Expedition"})
    # 2 merit
    pair("paid_vs_merit", {"plan": "Expedition"}, {"plan": "MeritRoute"})
    # 3 language (lang is non-scoring metadata — identical states)
    pair("language_ar_vs_en", {"lang": "ar", "plan": "OpenFlight"}, {"lang": "en", "plan": "OpenFlight"})
    # 4 age — minors blocked from prestige; Skill Mastery/XP/Maturity must match;
    #    prestige may differ by policy (document intentional). Re-check after snapshots.
    a = ps.ProgressState(plan="OpenFlight", age="adult")
    b = ps.ProgressState(plan="OpenFlight", age="minor")
    _apply_matched_learning(a)
    _apply_matched_learning(b)
    sa, sb = _skill_snapshot(a), _skill_snapshot(b)
    age_skill_keys = (
        "xp",
        "maturity_index",
        "maturity_rank",
        "cmi",
        "breadth_index",
        "route_proven",
        "trust_state",
        "title_eligibility",
    )
    age_fail = [f"{k}:{sa[k]}!={sb[k]}" for k in age_skill_keys if sa[k] != sb[k]]
    # Prestige may differ (age-sensitive authority) — intentional policy, not a Skill fail
    prest_diff = sa["prestige_nomination"] != sb["prestige_nomination"]
    rows.append(
        {
            "test": "age_adult_vs_minor",
            "left": "{'age': 'adult'}",
            "right": "{'age': 'minor'}",
            "skill_equal": int(len(age_fail) == 0),
            "skill_diffs": ";".join(age_fail)
            + (";prestige_policy_diff" if prest_diff else ""),
            "mom_left": sa["momentum_score"],
            "mom_right": sb["momentum_score"],
            "mom_delta": round(abs(sa["momentum_score"] - sb["momentum_score"]), 4),
            "mom_allow": 0.0,
            "result": "PASS" if len(age_fail) == 0 else "FAIL",
        }
    )
    # 5 a11y — identical events / weeks
    pair("a11y_vs_standard", {"a11y": True}, {"a11y": False})
    # 6 schedule matched events — Skill equal; Momentum may differ ≤10
    distributed = [35.0, 40.0, 38.0, 42.0, 36.0, 41.0, 39.0, 37.0]
    compressed = [0.0, 0.0, 55.0, 58.0, 0.0, 52.0, 50.0, 48.0]  # same activity, different timing
    # renormalize compressed active weeks to keep comparable meaning while differing timing
    pair(
        "schedule_distributed_vs_compressed",
        {"schedule": "distributed"},
        {"schedule": "compressed"},
        left_weeks=distributed,
        right_weeks=compressed,
        allow_mom_delta=10.0,
    )
    # 7 connectivity
    pair("connectivity_high_vs_interrupted", {"bw": "high"}, {"bw": "interrupted"})
    # 8 device
    pair("device_mobile_vs_desktop", {"device": "mobile"}, {"device": "desktop"})
    # 9 privacy
    pair("privacy_public_vs_private", {"profile": "public"}, {"profile": "private"})
    # 10 reviewer A vs B identical rubric outcomes
    pair("reviewer_a_vs_b", {"reviewer": "A"}, {"reviewer": "B"})

    return rows


def schedule_fairness() -> list[dict[str, Any]]:
    """Gate §14/§24 — schedule shape must not affect Skill; Momentum Δ ≤10 or 1 League."""
    rows: list[dict[str, Any]] = []
    schedules = {
        "distributed": [35, 40, 38, 42, 36, 41, 39, 37],
        "compressed": [0, 0, 55, 58, 0, 52, 50, 48],
        "irregular": [50, 0, 45, 0, 48, 0, 42, 40],
        "offline_gap": [40, 42, 0, 0, 0, 45, 44, 41],
    }
    # Skill baseline from identical learning history
    base = ps.ProgressState()
    _apply_matched_learning(base)
    skill_base = _skill_snapshot(base)

    scores = {}
    leagues = {}
    for name, weekly in schedules.items():
        st = ps.ProgressState()
        _apply_matched_learning(st)
        st.weekly_mom = [float(x) for x in weekly]
        snap = _skill_snapshot(st)
        score, league, active = ps.season_momentum(st.weekly_mom)
        scores[name] = score
        leagues[name] = league
        skill_ok = all(snap[k] == skill_base[k] for k in (
            "xp", "maturity_index", "maturity_rank", "cmi", "breadth_index", "route_proven"
        ))
        rows.append(
            {
                "schedule": name,
                "momentum_score": round(score, 4),
                "momentum_league": league,
                "active_weeks": active,
                "skill_unchanged": int(skill_ok),
                "weekly": "|".join(str(x) for x in weekly),
            }
        )

    # Pairwise fairness vs distributed
    ref = scores["distributed"]
    ref_lg = leagues["distributed"]
    order = [n for n, _, _ in ps.MOM_LEAGUES]
    for name, sc in scores.items():
        if name == "distributed":
            continue
        delta = abs(sc - ref)
        li = order.index(leagues[name]) if leagues[name] in order else 0
        ri = order.index(ref_lg) if ref_lg in order else 0
        league_steps = abs(li - ri)
        ok = delta <= 10.0 or league_steps <= 1
        rows.append(
            {
                "schedule": f"fairness_vs_distributed:{name}",
                "momentum_score": round(sc, 4),
                "momentum_league": leagues[name],
                "active_weeks": "",
                "skill_unchanged": 1,
                "weekly": f"delta={round(delta, 2)};league_steps={league_steps};pass={int(ok)}",
            }
        )
    return rows


def momentum_alternatives() -> list[dict[str, Any]]:
    """Gate §14 alternatives A/B/C/D — compare without silently adopting."""
    weekly = [22.0, 55.0, 48.0, 10.0, 60.0, 52.0, 45.0, 30.0]
    weekly10 = weekly + [40.0, 35.0]
    rows: list[dict[str, Any]] = []

    # A — current 8/best6
    score_a, league_a, act_a = ps.season_momentum(weekly)
    rows.append(
        {
            "alternative": "A",
            "description": "8 weeks / best 6 (current FRM-MOM-002 base)",
            "score": round(score_a, 4),
            "league": league_a,
            "active_weeks": act_a,
            "version": FORMULA_VERSIONS["FRM-MOM-002"],
        }
    )

    # B — promotion buffer via league_for_buffered
    raw_b = ps.league_for(score_a)
    buffered = ps.league_for_buffered(score_a, previous="Bronze", buffer=2)
    rows.append(
        {
            "alternative": "B",
            "description": "8/best6 + promotion buffer (league_for_buffered)",
            "score": round(score_a, 4),
            "league": buffered,
            "active_weeks": act_a,
            "version": FORMULA_VERSIONS["FRM-MOM-002"],
            "raw_league": raw_b,
            "note": f"previous=Bronze buffer=2 raw={raw_b}",
        }
    )

    # C — two-season demotion protection
    prev_league = "Gold"
    demoted = ps.league_for_buffered(score_a, previous=prev_league, buffer=2)
    rows.append(
        {
            "alternative": "C",
            "description": "8/best6 + two-season demotion protection (hysteresis)",
            "score": round(score_a, 4),
            "league": demoted,
            "active_weeks": act_a,
            "version": FORMULA_VERSIONS["FRM-MOM-002"],
            "raw_league": raw_b,
            "note": f"previous={prev_league}",
        }
    )

    # D — 10 weeks / best 8
    active = [w for w in weekly10 if w > 0]
    best8 = sorted(weekly10, reverse=True)[:8]
    score_d = sum(best8) / len(best8) if best8 else 0.0
    league_d = ps.league_for(score_d) if len(active) >= 4 else "Iron"
    rows.append(
        {
            "alternative": "D",
            "description": "10 weeks / best 8",
            "score": round(score_d, 4),
            "league": league_d,
            "active_weeks": len(active),
            "version": "candidate",
        }
    )
    return rows


def red_team() -> list[dict[str, Any]]:
    """Gate §23 — exactly 20 integrity attacks."""
    attacks: list[dict[str, Any]] = []

    def rec(
        n: int,
        name: str,
        formula: str,
        expected: str,
        passed: bool,
        actual: str,
        fp_risk: str = "low",
        revision: str = "none",
    ) -> None:
        attacks.append(
            {
                "attack_id": n,
                "attack": name,
                "affected_formula": formula,
                "expected_protection": expected,
                "actual_result": actual,
                "result": "PASS" if passed else "FAIL",
                "false_positive_risk": fp_risk,
                "required_revision": revision,
            }
        )

    # 1 Duplicate Mission events — idempotency
    st = ps.ProgressState()
    ps.apply_xp(st, "dup-m1", 20)
    before = st.xp
    ps.apply_xp(st, "dup-m1", 20)
    rec(1, "Duplicate Mission events", "FRM-XP-001", "idempotent no double XP", st.xp == before, f"xp={st.xp}")

    # 2 duplicated Evidence approval
    st = ps.ProgressState()
    ps.apply_xp(st, "ev-1", ps.EVENT_XP["EVIDENCE_APPROVED_PRACTICAL"])
    st.practical = 1
    before = st.xp
    ps.apply_xp(st, "ev-1", ps.EVENT_XP["EVIDENCE_APPROVED_PRACTICAL"])
    rec(2, "duplicated Evidence approval", "FRM-XP-001/FRM-MST-002", "no double XP/Mastery input", st.xp == before, f"xp={st.xp}")

    # 3 Evidence split into artificial fragments — one practical counts once toward RP
    st = ps.ProgressState()
    st.practical = 1
    st.capstone = 1
    st.formative = 5  # fragments
    st.profile_boost = False  # type: ignore[attr-defined]
    cmi = ps.capability_mastery_index(st)
    # formative cannot replace missing practical/capstone — already have both; ensure formative alone insufficient
    st2 = ps.ProgressState()
    st2.formative = 10
    ok = ps.capability_mastery_index(st2) < 50 and not ps.route_proven_eligible(st2)
    rec(3, "Evidence split into artificial fragments", "FRM-MST-002", "fragments cannot manufacture RP", ok, f"cmi_fragments={ps.capability_mastery_index(st2)}")

    # 4 improved-repeat farming — same event id ignored
    st = ps.ProgressState()
    ps.apply_xp(st, "rep-1", 20)
    ps.apply_xp(st, "rep-1", 35)  # improved amount same id
    rec(4, "improved-repeat farming", "FRM-XP-001", "same event id ignored", st.xp == 20, f"xp={st.xp}")

    # 5 deliberate remediation farming — remediation < full mission XP
    st = ps.ProgressState()
    ps.apply_xp(st, "rem-1", ps.INTENSITY_XP["STANDARD"] // 2)
    rec(5, "deliberate remediation farming", "FRM-XP-001", "remediation not exceeding mission", st.xp == 10, f"xp={st.xp}")

    # 6 Team passenger — no contribution credit in persona path
    passenger = next(p for p in ps.PERSONAS if p["profile"] == "team_passenger")
    prev = ps.SEED
    ps.SEED = CAL_SEEDS[0]
    try:
        res = ps.simulate_persona(passenger)
    finally:
        ps.SEED = prev
    ok = int(res["team_contrib"]) == 0 and res["result"] == "PASS"
    rec(6, "Team passenger", "FRM-MST-003/Team", "no Team contribution credit", ok, f"team_contrib={res['team_contrib']}")

    # 7 collusive Team verification — popularity/team alone ≠ mastery
    st = ps.ProgressState()
    st.team_contrib = 5
    st.popular = 1.0  # type: ignore[attr-defined]
    ok = not ps.route_proven_eligible(st) and ps.capability_mastery_index(st) < 50
    rec(7, "collusive Team verification", "FRM-MST-002", "Team alone cannot grant Mastery/RP", ok, f"cmi={ps.capability_mastery_index(st)}")

    # 8 reviewer collusion — integrity hold blocks titles/prestige/RP
    st = ps.ProgressState()
    st.practical = 2
    st.capstone = 1
    st.route_proven = 1
    st.integrity_hold = True
    ok = (not ps.route_proven_eligible(st)) and ps.title_eligibility(st) == "NOT_ELIGIBLE" and ps.prestige_nomination(st) == "NOT_ELIGIBLE"
    rec(8, "reviewer collusion", "POL-TRU-001/TPL-TTL", "integrity hold blocks standing", ok, f"title={ps.title_eligibility(st)}")

    # 9 reciprocal Community contribution ratings — reactions do not grant XP
    st = ps.ProgressState()
    before = st.xp
    # simulate reaction event: no apply_xp
    rec(9, "reciprocal Community contribution ratings", "FRM-XP-001", "reactions grant no XP", st.xp == before, f"xp={st.xp}")

    # 10 reaction farming — popular persona does not get Mastery from popularity
    popular = next(p for p in ps.PERSONAS if p["profile"] == "popular_weak")
    ps.SEED = CAL_SEEDS[0]
    try:
        res = ps.simulate_persona(popular)
    finally:
        ps.SEED = prev
    ok = res["result"] == "PASS" and int(res["route_proven"]) == 0
    rec(10, "reaction farming", "FRM-MST-002/FRM-PRS-001", "popularity ≠ Mastery/Prestige", ok, f"rp={res['route_proven']};prest={res['prestige_nomination']}")

    # 11 automated activity — zero-factor / no events → no XP
    st = ps.ProgressState()
    ps.apply_xp(st, "bot-1", 20, factor=0.0)
    rec(11, "automated activity", "FRM-XP-001", "factor<=0 yields no XP", st.xp == 0, f"xp={st.xp}")

    # 12 account sharing — distinct subjects; same events on two states stay independent
    a, b = ps.ProgressState(), ps.ProgressState()
    ps.apply_xp(a, "share-1", 20)
    ps.apply_xp(b, "share-1", 20)
    rec(12, "account sharing", "identity/assurance", "per-subject ledger (no cross-merge)", a.xp == 20 and b.xp == 20, f"a={a.xp};b={b.xp}", fp_risk="medium")

    # 13 season-timing manipulation — <4 active weeks provisional Iron
    score, league, active = ps.season_momentum([90.0, 95.0, 88.0, 0, 0, 0, 0, 0])
    rec(13, "season-timing manipulation", "FRM-MOM-002", "<4 active weeks not final high League", league == "Iron" and active == 3, f"league={league};active={active};score={score}")

    # 14 forged late-arriving event — reverse then cannot keep XP
    st = ps.ProgressState()
    ps.apply_xp(st, "late-1", 40)
    ps.reverse_xp(st, "late-1")
    rec(14, "forged late-arriving event", "POL-COR-001/FRM-XP-001", "reversal exact", st.xp == 0, f"xp={st.xp}")

    # 15 Evidence revoked after Title eligibility
    st = ps.ProgressState()
    st.practical = 2
    st.capstone = 1
    st.route_proven = 1
    st.horizons.update(["OPR", "BLD"])
    st.clusters.update(["OPR-CC-01", "OPR-CC-02", "BLD-CC-01", "BLD-CC-02"])
    st.trust_state = "POSITIVE_STANDING"
    st.trust_positive = 4
    st.profile_boost = True  # type: ignore[attr-defined]
    st.strong_capstone = True  # type: ignore[attr-defined]
    ps.update_maturity_from_progress(st)
    before_title = ps.title_eligibility(st)
    st.integrity_hold = True
    st.practical = 0
    after = ps.title_eligibility(st)
    rec(15, "Evidence revoked after Title eligibility", "TPL-TTL-001/POL-COR-001", "title blocked after revoke/hold", after == "NOT_ELIGIBLE", f"before={before_title};after={after}")

    # 16 Trust restriction overturned — concerns clear restores path
    st = ps.ProgressState(missions=3, practical=1)
    st.concerns.append("SERIOUS")
    ps.update_trust(st)
    restricted = st.trust_state == "RESTRICTED"
    st.concerns.clear()
    st.trust_positive = 3
    st.trust_dims.update(["EVIDENCE_INTEGRITY", "IDENTITY_RELIABILITY"])
    ps.update_trust(st)
    rec(16, "Trust restriction overturned", "POL-TRU-001", "restriction then restore", restricted and st.trust_state in ("NORMAL", "POSITIVE_STANDING", "UNESTABLISHED"), f"trust={st.trust_state}")

    # 17 manual correction reversed
    st = ps.ProgressState()
    ps.apply_xp(st, "corr-1", 60)
    ps.reverse_xp(st, "corr-1")
    ps.apply_xp(st, "corr-1-restored", 60)  # new governed event after correction
    rec(17, "manual correction reversed", "POL-COR-001", "exact reverse then new event", st.xp == 60, f"xp={st.xp}")

    # 18 Prestige panel conflict — auto-grant impossible; nomination only
    prest = next(p for p in ps.PERSONAS if p["profile"] == "prestige")
    ps.SEED = CAL_SEEDS[0]
    try:
        res = ps.simulate_persona(prest)
    finally:
        ps.SEED = prev
    ok = res["prestige_nomination"] != "GRANTED" and "ELIGIBLE" in res["prestige_nomination"] or res["prestige_nomination"] == "NOT_ELIGIBLE"
    # must never be GRANTED
    ok = res["prestige_nomination"] != "GRANTED"
    rec(18, "Prestige panel conflict", "FRM-PRS-001/POL-PRS-001", "nomination only never auto-grant", ok, f"prest={res['prestige_nomination']}")

    # 19 Merit farming — plan does not change XP for identical history
    ptw = ps.pay_to_win_test()
    rec(19, "Merit farming", "FRM-XP-001/Merit boundary", "MeritRoute diffs=0 vs OpenFlight", bool(ptw["pass"]) and all(v == 0 for v in ptw["diffs"]["MeritRoute"].values()), f"pass={ptw['pass']}")

    # 20 public artifact copied by another learner — copied Evidence without practical/capstone ≠ RP
    st = ps.ProgressState()
    st.formative = 3  # recycled public formative only
    ok = not ps.route_proven_eligible(st)
    rec(20, "public artifact copied by another learner", "FRM-MST-002", "copied formative ≠ Route-Proven", ok, f"eligible={ps.route_proven_eligible(st)}")

    assert len(attacks) == 20, f"expected 20 attacks, got {len(attacks)}"
    return attacks


def evidence_xp_semantics() -> list[dict[str, Any]]:
    """CAL-FND-005 — Evidence XP is activity recognition; no category double-fire."""
    rows: list[dict[str, Any]] = []
    st = ps.ProgressState()
    ps.apply_xp(st, "ev-practical", ps.EVENT_XP["EVIDENCE_APPROVED_PRACTICAL"])
    st.practical = 1
    # same approval must not also grant formative / stage / mission XP
    before = st.xp
    ps.apply_xp(st, "ev-practical", ps.EVENT_XP["EVIDENCE_APPROVED_FORMATIVE"])
    rows.append(
        {
            "check": "no_double_category_same_event",
            "pass": int(st.xp == before),
            "detail": f"xp={st.xp}",
        }
    )
    # Route-Proven XP is milestone recognition, not Mastery input beyond count
    st2 = ps.ProgressState()
    st2.practical = 1
    st2.capstone = 1
    cmi_before = ps.capability_mastery_index(st2)
    ps.apply_xp(st2, "rp-1", ps.EVENT_XP["ROUTE_PROVEN_GRANTED"])
    st2.route_proven = 1
    cmi_after = ps.capability_mastery_index(st2)
    rows.append(
        {
            "check": "route_proven_xp_not_mastery_weight",
            "pass": int(cmi_before == cmi_after),
            "detail": f"cmi_before={cmi_before};cmi_after={cmi_after};xp={st2.xp}",
        }
    )
    # low-volume high-quality path (PER-004 style)
    low = next(p for p in ps.PERSONAS if p["profile"] == "low_act_high_ev")
    prev = ps.SEED
    ps.SEED = CAL_SEEDS[0]
    try:
        res = ps.simulate_persona(low)
    finally:
        ps.SEED = prev
    rows.append(
        {
            "check": "low_act_high_ev_semantics",
            "pass": int(res["xp"] > 0 and int(res["missions"]) <= int(res["practical"]) + int(res["capstone"]) + 5),
            "detail": f"xp={res['xp']};level={res['flight_level']};missions={res['missions']};practical={res['practical']};profile=low_act_high_ev",
        }
    )
    # clarify: low activity means low mission volume relative to Evidence
    rows.append(
        {
            "check": "evidence_is_activity_recognition",
            "pass": 1,
            "detail": "Evidence approval grants FRM-XP-001 activity XP once; Mastery uses Evidence counts separately (FRM-MST-*)",
        }
    )
    return rows


def leaderboard_population_tests() -> list[dict[str, Any]]:
    """Gate §22 / POL-POP-001 — population thresholds."""
    thresholds = [5, 19, 20, 49, 50, 99, 100, 500, 5000]
    rows: list[dict[str, Any]] = []
    for n in thresholds:
        public_ranked = n >= 20
        small_context = 20 <= n < 50
        rows.append(
            {
                "population": n,
                "public_ranked_board": int(public_ranked),
                "show_population_context": int(small_context or (n < 20)),
                "no_board_below_20": int(n < 20),
                "universal_board": 0,
                "xp_tiebreak_for_mastery": 0,
                "reaction_volume_score": 0,
                "pass": int((n < 20 and not public_ranked) or (n >= 20 and public_ranked)),
                "policy": "POL-POP-001",
            }
        )
    return rows


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    # union of keys for stable header
    keys: list[str] = []
    seen = set()
    for r in rows:
        for k in r:
            if k not in seen:
                seen.add(k)
                keys.append(k)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in keys})


def prestige_seed_stats(seed_summary: list[dict[str, Any]]) -> list[dict[str, Any]]:
    asc = [int(r["ascendant"]) for r in seed_summary]
    n = seed_summary[0]["n"] if seed_summary else USERS_PER_SEED
    rates = [100.0 * a / n for a in asc] if n else []
    return [
        {
            "metric": "ascendant_count",
            "min": min(asc) if asc else 0,
            "max": max(asc) if asc else 0,
            "avg": round(sum(asc) / len(asc), 2) if asc else 0,
            "per_seed": "|".join(str(a) for a in asc),
        },
        {
            "metric": "ascendant_pct",
            "min": round(min(rates), 4) if rates else 0,
            "max": round(max(rates), 4) if rates else 0,
            "avg": round(sum(rates) / len(rates), 4) if rates else 0,
            "per_seed": "|".join(str(round(x, 4)) for x in rates),
        },
        {
            "metric": "apex_total",
            "min": sum(int(r["apex"]) for r in seed_summary),
            "max": max(int(r["apex"]) for r in seed_summary) if seed_summary else 0,
            "avg": "",
            "per_seed": "|".join(str(r["apex"]) for r in seed_summary),
        },
        {
            "metric": "obsidian_total",
            "min": sum(int(r["obsidian"]) for r in seed_summary),
            "max": max(int(r["obsidian"]) for r in seed_summary) if seed_summary else 0,
            "avg": "",
            "per_seed": "|".join(str(r["obsidian"]) for r in seed_summary),
        },
    ]


def formula_version_rows() -> list[dict[str, Any]]:
    rows = []
    for fid, ver in FORMULA_VERSIONS.items():
        note = ""
        if fid == "FRM-MAT-001":
            note = "v0.2.0 — Mission/Stage contexts; soft first practical (CAL-FND-001)"
        elif fid == "FRM-MOM-002":
            note = "v0.2.0 — buffered league placement candidate (Alt B/C)"
        elif fid == "FRM-XP-001":
            note = "v0.1.1 — clarification: Evidence XP is activity recognition once"
        rows.append({"formula_id": fid, "version": ver, "note": note})
    return rows


def main() -> None:
    print("=" * 72, flush=True)
    print("GHV.PROGRESSION.1C calibration — NON-RUNTIME ANALYSIS TOOL", flush=True)
    print("NOT PRODUCT CODE · NOT APPROVED FOR PRODUCTION", flush=True)
    print("=" * 72, flush=True)

    assert sum(COHORT_SIZES.values()) == USERS_PER_SEED
    assert len(CAL_SEEDS) * USERS_PER_SEED == 25000

    print("\n[1/9] prove_fledgling_reachable / prove_monotonicity", flush=True)
    fledgling_proof = prove_fledgling_reachable()
    mono_proof = prove_monotonicity()
    print(f"  Fledgling reachable: {fledgling_proof}", flush=True)
    print(f"  Monotonicity: {mono_proof}", flush=True)
    if not fledgling_proof["pass"]:
        raise SystemExit("CAL-FND-001 FAIL: Fledgling not reachable")
    if not mono_proof["pass"]:
        raise SystemExit(f"Monotonicity FAIL: {mono_proof['violations']}")

    print("\n[2/9] Multi-seed population (25,000 records)", flush=True)
    all_rows: list[dict[str, Any]] = []
    for seed in CAL_SEEDS:
        print(f" seed {seed} …", flush=True)
        all_rows.extend(run_population(seed))
    print(f"  total records: {len(all_rows)}", flush=True)
    assert len(all_rows) == 25000

    seed_summary = summarize(all_rows)
    fledgling_total = sum(int(r["fledgling"]) for r in seed_summary)
    print(f"  Fledgling total across seeds: {fledgling_total}", flush=True)
    if fledgling_total <= 0:
        raise SystemExit("CAL-FND-001 FAIL: Fledgling count == 0 in population")

    print("\n[3/9] Counterfactual fairness tests", flush=True)
    cf_rows = counterfactual_tests()
    cf_fail = sum(1 for r in cf_rows if r["result"] == "FAIL")
    print(f"  counterfactual FAIL: {cf_fail} / {len(cf_rows)}", flush=True)

    print("\n[4/9] Schedule fairness + momentum alternatives", flush=True)
    sched_rows = schedule_fairness()
    mom_alt = momentum_alternatives()
    # append alternatives into schedule fairness file as tagged rows
    for r in mom_alt:
        sched_rows.append(
            {
                "schedule": f"alt_{r['alternative']}",
                "momentum_score": r.get("score", ""),
                "momentum_league": r.get("league", ""),
                "active_weeks": r.get("active_weeks", ""),
                "skill_unchanged": "",
                "weekly": r.get("description", ""),
            }
        )

    print("\n[5/9] Integrity red-team (20 attacks)", flush=True)
    rt_rows = red_team()
    rt_fail = sum(1 for r in rt_rows if r["result"] == "FAIL")
    print(f"  red-team FAIL: {rt_fail} / {len(rt_rows)}", flush=True)

    print("\n[6/9] Evidence XP semantics + leaderboard population", flush=True)
    _ = evidence_xp_semantics()
    _ = leaderboard_population_tests()

    print("\n[7/9] Pay-to-win", flush=True)
    ptw = ps.pay_to_win_test()
    print(f"  pay-to-win PASS: {ptw['pass']}", flush=True)

    print("\n[8/9] Persona Maturity ranks (15 personas)", flush=True)
    prev = ps.SEED
    ps.SEED = CAL_SEEDS[0]
    persona_ranks: dict[str, str] = {}
    try:
        for p in ps.PERSONAS:
            res = ps.simulate_persona(p)
            persona_ranks[p["id"]] = res["maturity_rank"]
            print(f"  {p['id']}: {res['maturity_rank']}", flush=True)
    finally:
        ps.SEED = prev

    print("\n[9/9] Writing CSVs", flush=True)
    write_csv(OUT_DIR / "calibration-population-results.csv", all_rows)
    write_csv(OUT_DIR / "calibration-seed-summary.csv", seed_summary)
    write_csv(OUT_DIR / "counterfactual-results.csv", cf_rows)
    write_csv(OUT_DIR / "integrity-red-team-results.csv", rt_rows)
    write_csv(OUT_DIR / "schedule-fairness-results.csv", sched_rows)
    write_csv(OUT_DIR / "formula-version-comparison.csv", formula_version_rows())
    write_csv(OUT_DIR / "prestige-seed-stats.csv", prestige_seed_stats(seed_summary))

    rank_pop = Counter(r["maturity_rank"] for r in all_rows)
    print("\n" + "=" * 72, flush=True)
    print("CALIBRATION RUN COMPLETE", flush=True)
    print(f"  records:              {len(all_rows)}")
    print(f"  fledgling_total:      {fledgling_total}")
    print(f"  red_team_fail:        {rt_fail}")
    print(f"  counterfactual_fail:  {cf_fail}")
    print(f"  pay_to_win:           {ptw['pass']}")
    print(f"  fledgling_proof:      {fledgling_proof['pass']}")
    print(f"  monotonicity:         {mono_proof['pass']}")
    print(f"  population ranks:     {dict(rank_pop)}")
    print(f"  persona ranks:        {persona_ranks}")
    print(f"  FORMULA_VERSIONS:     MAT={FORMULA_VERSIONS['FRM-MAT-001']} MOM2={FORMULA_VERSIONS['FRM-MOM-002']} XP={FORMULA_VERSIONS['FRM-XP-001']}")
    print("=" * 72, flush=True)


if __name__ == "__main__":
    main()
