# References

## Procedure and scoring
- Greenwald, A. G., McGhee, D. E., & Schwartz, J. L. K. (1998). Measuring individual differences in
  implicit cognition: The Implicit Association Test. *Journal of Personality and Social Psychology,
  74*(6), 1464–1480. https://doi.org/10.1037/0022-3514.74.6.1464
  — original seven-block procedure; Appendix A has the flowers/insects and pleasant/unpleasant word lists.
- Greenwald, A. G., Nosek, B. A., & Banaji, M. R. (2003). Understanding and using the Implicit
  Association Test: I. An improved scoring algorithm. *Journal of Personality and Social Psychology,
  85*(2), 197–216. https://doi.org/10.1037/0022-3514.85.2.197
  — the D measure (latency difference / pooled SD), built-in error penalty, >10 s and >10 %-fast rules.
- Nosek, B. A., Greenwald, A. G., & Banaji, M. R. (2005). Understanding and using the Implicit
  Association Test: II. Method variables and construct validity. *Personality and Social Psychology
  Bulletin, 31*(2), 166–180. https://doi.org/10.1177/0146167204271418
  — effects of block order, trial counts, and the 28/40-trial switch block.
- Lane, K. A., Banaji, M. R., Nosek, B. A., & Greenwald, A. G. (2007). Understanding and using the
  Implicit Association Test: IV. What we know (so far) about the method. In B. Wittenbrink & N. Schwarz
  (Eds.), *Implicit measures of attitudes* (pp. 59–102). Guilford.
- Nosek, B. A., Smyth, F. L., Hansen, J. J., Devos, T., Lindner, N. M., Ranganath, K. A., Smith, C. T.,
  Olson, K. R., Chugh, D., Greenwald, A. G., & Banaji, M. R. (2007). Pervasiveness and correlates of
  implicit attitudes and stereotypes. *European Review of Social Psychology, 18*(1), 36–88.
  https://doi.org/10.1080/10463280701489053
  — the citation Project Implicit asks for when its stimulus materials are used.

## Reference implementation
- Bar-Anan, Y., et al. *minno-tasks*. https://github.com/baranan/minno-tasks — Project Implicit's open
  task library. `IAT/qualtrics/quiat9.js` is the task every example config loads; `scorer/nogaScorer.js`
  is its scorer. This repository's PROTOCOL file compares parameters line by line; pinned commit in
  PROVENANCE.txt.
- Project Implicit. *Study materials*. https://www.projectimplicit.net/resources/study-materials/

## On interpretation (worth reading before drawing conclusions from a score)
- Greenwald, A. G., Poehlman, T. A., Uhlmann, E. L., & Banaji, M. R. (2009). Understanding and using the
  Implicit Association Test: III. Meta-analysis of predictive validity. *Journal of Personality and
  Social Psychology, 97*(1), 17–41. https://doi.org/10.1037/a0015575
- Oswald, F. L., Mitchell, G., Blanton, H., Jaccard, J., & Tetlock, P. E. (2013). Predicting ethnic and
  racial discrimination: A meta-analysis of IAT criterion studies. *Journal of Personality and Social
  Psychology, 105*(2), 171–192. https://doi.org/10.1037/a0032734
- Greenwald, A. G., & Lai, C. K. (2020). Implicit social cognition. *Annual Review of Psychology, 71*,
  419–445. https://doi.org/10.1146/annurev-psych-010419-050837
  — test–retest reliability of a single IAT score is around r ≈ .5; the measure is better at
  characterising groups than individuals.
