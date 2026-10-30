/* iat_random.h — where every random choice in a session comes from (parallel to web/iat_random.js).
 *
 * By default every draw asks the operating system (getrandom(2)), so no choice the participant sees
 * comes from a formula they could, even in principle, become attuned to.  Passing --seed N switches
 * to a seeded generator instead, so a session (or an automated test) can be replayed exactly; that is
 * the only reason a formula exists here at all.
 */
#ifndef IAT_RANDOM_H
#define IAT_RANDOM_H

#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/random.h>

typedef enum {
    RANDOM_SOURCE_OPERATING_SYSTEM,   /* getrandom() for every draw: the default */
    RANDOM_SOURCE_SEEDED              /* Mulberry32 from --seed: reproducible, for replays and tests */
} random_source_t;

typedef struct {
    random_source_t source;
    uint32_t seeded_state;
} random_t;

static void random_init_operating_system(random_t *random);
static void random_init_seeded(random_t *random, uint32_t seed);

/* A uniformly distributed integer in [0, count).  count must be >= 1. */
static int random_below(random_t *random, int count);

/* ---------------------------------------------------------------------------------------------- */

static void random_init_operating_system(random_t *random)
{
    random->source = RANDOM_SOURCE_OPERATING_SYSTEM;
    random->seeded_state = 0;
}

static void random_init_seeded(random_t *random, uint32_t seed)
{
    random->source = RANDOM_SOURCE_SEEDED;
    random->seeded_state = seed;
}

/* 32 bits from getrandom(); a failure is reported and ends the program rather than falling back to
   something weaker without saying so. */
static uint32_t random_operating_system_u32(void)
{
    uint32_t value;
    ssize_t got;
    do {
        got = getrandom(&value, sizeof value, 0);
    } while (got < 0 && errno == EINTR);
    if (got != (ssize_t)sizeof value) {
        perror("getrandom");
        exit(1);
    }
    return value;
}

/* Mulberry32 (Tommy Ettinger, public domain): a 32-bit state, one add and a few multiply/xor-shifts per
   draw; statistically adequate for shuffling, not cryptographic.  Identical to web/iat_random.js, so
   the same --seed draws the same numbers in both. */
static uint32_t random_seeded_u32(random_t *random)
{
    uint32_t t;
    random->seeded_state += 0x6D2B79F5u;
    t = random->seeded_state;
    t = (t ^ (t >> 15)) * (t | 1u);
    t ^= t + (t ^ (t >> 7)) * (t | 61u);
    return t ^ (t >> 14);
}

static uint32_t random_next_u32(random_t *random)
{
    if (random->source == RANDOM_SOURCE_SEEDED) {
        return random_seeded_u32(random);
    }
    return random_operating_system_u32();
}

/* Rejection sampling: draws that fall in the incomplete top range are redrawn, so every outcome is
   exactly equally likely (a plain modulo would favour small values slightly). */
static int random_below(random_t *random, int count)
{
    uint32_t bound = (uint32_t)count;
    uint32_t limit = UINT32_MAX - UINT32_MAX % bound;   /* largest multiple of bound */
    uint32_t value;
    do {
        value = random_next_u32(random);
    } while (value >= limit);
    return (int)(value % bound);
}

#endif
