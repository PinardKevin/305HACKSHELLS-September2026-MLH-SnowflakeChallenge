# MLH — Best Use of Snowflake API

This repository is the **Snowflake / MLH track copy** of EmpowHER.

- Original (unchanged): https://github.com/whatsgooglyKP/305HACKSHELLS-September2026
- This fork: https://github.com/PinardKevin/305HACKSHELLS-September2026-MLH-SnowflakeChallenge

## What we call

Letter reader + advisor chat can run on **Snowflake Cortex REST** (one Snowflake account, many industry LLMs) with the same curl-shaped POST MLH describes:

```bash
curl "https://<account-identifier>.snowflakecomputing.com/api/v2/cortex/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SNOWFLAKE_PAT>" \
  -d '{
    "model": "llama3.1-70b",
    "messages": [
      {"role": "user", "content": "This ELC letter says my School Readiness packet is incomplete. What is the deadline and what do I bring?"}
    ]
  }'
```

Implementation: `src/utils/snowflakeCortex.ts`  
Hook: `POST /api/chat` in `server.ts` prefers Cortex when `SNOWFLAKE_ACCOUNT` + `SNOWFLAKE_PAT` are set, then Gemini, then the offline Miami-Dade reasoner.

## Env

Copy `.env.example` → `.env`:

```
SNOWFLAKE_ACCOUNT=orgname-account
SNOWFLAKE_PAT=your_personal_access_token
SNOWFLAKE_CORTEX_MODEL=llama3.1-70b
```

Trial: https://mlh.link/snowflake-signup  
Grant the API user `SNOWFLAKE.CORTEX_USER`.

## Response mode

JSON from `/api/chat` includes `mode: "snowflake-cortex"` when Cortex answered, so a judge can see the path without opening Snowsight.
