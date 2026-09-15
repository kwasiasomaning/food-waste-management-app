# Tonight

Household food-waste dinner app. Rank recipes by what expires first. Keep the loop small: pantry → three dinners → cook → savings.

Do not add a social feed, carbon leaderboard, or 14-day meal planner.

Web is `http://127.0.0.1:8081`. Start it with `./scripts/start-web.sh` so Metro binds IPv4 `0.0.0.0` and also `::1` (plain `expo start` is IPv6-only; IPv4-only bind misses `::1`, and Cursor Browser then gets connection refused).
