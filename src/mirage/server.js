import { createServer, Model } from "miragejs";
import { seedEmployees } from "./seeds";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      employee: Model,
    },

    seeds(server) {
      seedEmployees(server);
    },

    routes() {
      this.namespace = "api";

      // GET all employees
      this.get("/employees", (schema) => {
        return schema.employees.all().models;
      });

      // POST new employee
      this.post("/employees", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.employees.create(attrs);
      });

      // PUT - move employee (update managerId)
      this.put("/employees/:id/move", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const employee = schema.employees.find(id);
        if (employee) {
          employee.update({ managerId: attrs.managerId ?? null });
        }
        // return all employees
        return schema.employees.all().models;
      });
    },
  });
}
