function formatDate(date) {
  const formatedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formatedDate;
}

export default formatDate;
