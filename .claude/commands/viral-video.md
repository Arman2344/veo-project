---
description: Full agent-team pipeline for a viral science/animation video
argument-hint: <topic> [platform] [language]
---
Create a viral science/animation video package for: $ARGUMENTS

Run the team in order, passing outputs between them (slug = short kebab-case of the topic):
1. science-researcher → research.md
2. viral-strategist → strategy.md
3. scriptwriter → script.md
4. animation-director → shots.md + animation code
5. music-producer → music.md (score synced to the script)
Then summarize the package in `content/<slug>/README.md` and report the best hook, title and next steps.
