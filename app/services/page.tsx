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
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Services</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: <span className={service.status === "Active" ? "text-green-500" : "text-red-500"}>{service.status}</span></p>
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

