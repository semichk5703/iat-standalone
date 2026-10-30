# References

Machine-readable versions with URLs: [references/papers.bib](references/papers.bib). Page numbers below
were checked against the author-posted PDFs (`references/fetch_papers.sh`).

## Procedure and scoring
- Greenwald, A. G., McGhee, D. E., & Schwartz, J. L. K. (1998). Measuring individual differences in
  implicit cognition: The Implicit Association Test. *Journal of Personality and Social Psychology,
  74*(6), 1464–1480. https://doi.org/10.1037/0022-3514.74.6.1464
  — the original IAT: five steps of 50-trial blocks (p. 1467); word lists, 25 per category (Appendix A, p. 1479).
- Greenwald, A. G., Nosek, B. A., & Banaji, M. R. (2003). Understanding and using the Implicit
  Association Test: I. An improved scoring algorithm. *Journal of Personality and Social Psychology,
  85*(2), 197–216. https://doi.org/10.1037/0022-3514.85.2.197
  — the seven-block 20/20/20/40/20/20/40 layout (Table 1, p. 198); the D measure (Table 4, p. 213);
  the built-in error penalty (p. 206).
- Nosek, B. A., Greenwald, A. G., & Banaji, M. R. (2005). Understanding and using the Implicit
  Association Test: II. Method variables and construct validity. *Personality and Social Psychology
  Bulletin, 31*(2), 166–180. https://doi.org/10.1177/0146167204271418
  — lengthening the reversed-target block reduces order effects (Study 4, pp. 176–178).
- Lane, K. A., Banaji, M. R., Nosek, B. A., & Greenwald, A. G. (2007). Understanding and using the
  Implicit Association Test: IV. What we know (so far) about the method. In B. Wittenbrink & N. Schwarz
  (Eds.), *Implicit measures of attitudes* (pp. 59–102). Guilford.
- Axt, J. R., Feng, T. Y., & Bar-Anan, Y. (2021). The good and the bad: Are some attribute words better
  than others in the Implicit Association Test? *Behavior Research Methods, 53*(6), 2512–2527.
  https://doi.org/10.3758/s13428-021-01592-8 — the 32+32 attribute words the demo site samples from.
- Nosek, B. A., Smyth, F. L., Hansen, J. J., Devos, T., Lindner, N. M., Ranganath, K. A., Smith, C. T.,
  Olson, K. R., Chugh, D., Greenwald, A. G., & Banaji, M. R. (2007). Pervasiveness and correlates of
  implicit attitudes and stereotypes. *European Review of Social Psychology, 18*(1), 36–88.
  https://doi.org/10.1080/10463280701489053 — the citation Project Implicit asks for with its materials.

## Reference implementation
- *minno-tasks*, https://github.com/baranan/minno-tasks — `IAT/iat10.js` (the task),
  `docs/studies/datapipe.iat.examples/demo.iats/` (the demo site's task configs),
  `docs/studies/raceiat/raceiat_instructions.jst` (the pre-IAT instructions page).
- *minno-time*, https://github.com/minnojs/minno-time — `src/js/extensions/dscore/parcelMng.js`, the scorer.
- Pinned commits: PROVENANCE.txt. Parameter-by-parameter comparison: [PROTOCOL](PROTOCOL).

## On interpretation (worth reading before drawing conclusions from a score)
- Greenwald, A. G., Brendl, M., Cai, H., et al. (2019). *The Implicit Association Test at age 20: What is
  known and what is not known about implicit bias.* PsyArXiv, psyarxiv.com/bf97c
  — p. 18: test–retest reliability for socially sensitive attitudes "nearer to .50 and often lower".
- Greenwald, A. G., Poehlman, T. A., Uhlmann, E. L., & Banaji, M. R. (2009). Understanding and using the
  Implicit Association Test: III. Meta-analysis of predictive validity. *Journal of Personality and
  Social Psychology, 97*(1), 17–41. https://doi.org/10.1037/a0015575
- Oswald, F. L., Mitchell, G., Blanton, H., Jaccard, J., & Tetlock, P. E. (2013). Predicting ethnic and
  racial discrimination: A meta-analysis of IAT criterion studies. *Journal of Personality and Social
  Psychology, 105*(2), 171–192. https://doi.org/10.1037/a0032734
- Greenwald, A. G., & Lai, C. K. (2020). Implicit social cognition. *Annual Review of Psychology, 71*,
  419–445. https://doi.org/10.1146/annurev-psych-010419-050837
