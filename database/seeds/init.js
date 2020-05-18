exports.seed = function(knex) {

  const roles = [
    {
      name: "admin",
    },
    {
      name: "user",
    }
  ];

  return knex('roles').insert(roles);
};
