# Dev Installation 🚀

### Create a config folder inside root and the following in the default.json

```json
{
  "MongoURI": "<MongoDB_Atlas_uri>",
  "OpenAI_Key": "<API_Key_for_OpenAI>",
  "Anthropic_Key": "<API_Key_for_Anthropic>"
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```
