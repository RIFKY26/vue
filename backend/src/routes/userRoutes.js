import userController from "../controllers/userController.js";

async function userRoutes(fastify, options) {
  // GET semua user
  fastify.get("/users", userController.getAllUsers);

  // GET user by ID
  fastify.get("/users/:id", userController.getUserById);

  // UPDATE user
  fastify.put("/users/:id", userController.updateUser);

  // DELETE user
  fastify.delete("/users/:id", userController.deleteUser);

  // GET profile berdasarkan token (user sedang login)
  fastify.get("/user/profile", userController.getProfile);
}

export default userRoutes;
