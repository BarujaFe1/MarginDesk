# MarginDesk — Technical Methodology

## Margin model

Given services \(s_i\) with hours \(h_i\) and rate \(r_i\), direct costs \(c_j\), and contingency hours \(h_c\):

\[
L = \sum_i h_i r_i,\quad
\bar{r} = \frac{L}{\sum_i h_i},\quad
C_{cont} = h_c \bar{r},\quad
C = L + \sum_j c_j + C_{cont}
\]

\[
\pi = P - C,\quad
m = \frac{\pi}{P}\times 100
\]

Minimum price for target margin \(t\%\):

\[
P_{min} = \frac{C}{1 - t/100}
\]

## Scope risk score

Each checked flag contributes weight \(w_k \in [0, 25]\). Risk score \(R = \sum w_k\).

| Score | Level |
|------:|:------|
| < 18 | low |
| 18–34 | medium |
| 35–54 | high |
| ≥ 55 | critical |

## Planned vs actual

Tracker compares planned/actual hours, costs and margin. Alerts fire on hour overrun, margin drop and unpriced scope changes (demo heuristics).

## Out of scope (MVP)
Persistence, billing providers, PDF renderer production, multi-tenant auth.
