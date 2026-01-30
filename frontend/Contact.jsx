const submitForm = async (e) => {
  e.preventDefault();

  await fetch(
    "https://ni-wakati-sports-1.onrender.com/api/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    }
  );

  alert("Message sent successfully!");
};
