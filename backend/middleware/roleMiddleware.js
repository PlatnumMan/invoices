import { ADMIN, USER } from "../constants/index.js";

const ROLES = {
  User: USER,
  Admin: ADMIN,
};

const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user && !req?.roles) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const rolesArray = [...allowedRoles];

    const roleFound = req.roles
      .map((role) => rolesArray.includes(role))
      .find((value) => value === true);

    if (!roleFound) {
      res.status(401);
      throw new Error("Not authorized");
    }
    next();
  };
};

const role = { ROLES, checkRoles };

export default role;
