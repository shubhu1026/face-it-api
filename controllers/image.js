const fetch = require("cross-fetch");

const USER_ID = 'shubhu1026';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '4e15238e6f6443a88796c2219d3253c9';
const APP_ID = 'face-it';

const handleApiCall = (req, res) => {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": req.body.input
                    }
                }
            }
        ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(response => response.text())
    .then(result => res.json(result))
    .catch(err => {
        err => res.status(400).json('Something went wrong with the API call');
    });
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(user => {
        res.json(user[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};

module.exports = {  
    handleImage,
    handleApiCall
}