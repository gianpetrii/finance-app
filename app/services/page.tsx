import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    id: 1,
    name: "Budget Planner",
    description: "Plan and track your monthly budget",
    status: "Active",
  },
  {
    id: 2,
    name: "Bill Reminders",
    description: "Get notified before your bills are due",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Savings Goals",
    description: "Set and track your savings goals",
    status: "Active",
  },
  {
    id: 4,
    name: "Investment Tracker",
    description: "Monitor your investment portfolio",
    status: "Inactive",
  },
]

export default function Services() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Services</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {service.status}</p>
            </CardContent>
            <CardFooter>
              <Button variant={service.status === "Active" ? "outline" : "default"}>
                {service.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

