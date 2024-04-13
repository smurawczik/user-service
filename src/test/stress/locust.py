from locust import HttpUser, task, between

class StressTest(HttpUser):
    @task
    def users_endpoint(self):
        self.client.get("/users?limit=10&offset=0")
