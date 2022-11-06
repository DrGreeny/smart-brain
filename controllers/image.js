const handleApiCall = (req, res) => {
  console.log("ImageURL:", req.body.input);
  const raw = JSON.stringify({
    user_app_id: {
      user_id: "clarifai",
      app_id: "main",
    },
    inputs: [
      {
        data: {
          image: {
            url: req.body.input,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + "71b365d9f725411a8d117bef842e50c5",
    },
    body: raw,
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  fetch(
    `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
    requestOptions
  )
    .then((response) => {
      //console.log("Response:", response);
      response.text();
    })
    .then((result) => {
      //console.log("Result:", result);
      res.json(result);
    })
    .catch((error) => console.log("error", error));
};

const handleApiCall_old = (req, res) => {
  const imageUrl = req.body.input;
  const CONCEPT_NAME = "train";
  const CONCEPT_ID = "ai_6kTjGfF6";
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: "greeny82",
        app_id: "facerecognition",
      },
      model_id: "visual-detector", // This is model ID of the clarifai/main General model.
      inputs: [
        { data: { image: { url: imageUrl, allow_duplicate_url: true } } },
      ],
      // When selecting concepts, value is ignored, so no need to specify it.
      /* model: {
        output_info: {
          output_config: {
            select_concepts: [{ name: CONCEPT_NAME }, { id: CONCEPT_ID }],
          },
        },
      }, */
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      // Since we have one input, one output will exist here.
      const output = response.outputs[0];

      console.log("Predicted concepts:");
      for (const concept of output.data.concepts) {
        console.log(concept.name + " " + concept.value);
      }
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)

    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
