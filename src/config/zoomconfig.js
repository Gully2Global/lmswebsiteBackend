const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    APIKey: "weA7VE5Swuala1ePYN3bg",
    APISecret: "o2q46sj7757nKG8wwp1eFN2bfQNJsN1r",
  },
  production: {
    APIKey: "",
    APISecret: "",
  },
};

module.exports = config(env);
