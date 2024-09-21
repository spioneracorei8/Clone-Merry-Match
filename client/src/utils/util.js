const FormattedDate = (date) => {
  const formattedDate = new Date(date);
  return formattedDate.toISOString().split("T")[0];
};

export { FormattedDate };
