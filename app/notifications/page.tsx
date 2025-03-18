import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
  {
    id: 1,
    title: "New Transaction",
    description: "You have a new transaction of $50.00",
    date: "2023-04-01",
    read: false,
  },
  {
    id: 2,
    title: "Bill Due",
    description: "Your electricity bill is due in 3 days",
    date: "2023-03-30",
    read: false,
  },
  {
    id: 3,
    title: "Budget Alert",
    description: "You have exceeded your food budget for this month",
    date: "2023-03-28",
    read: true,
  },
]

export default function Notifications() {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
      </div>
      
      <div className="space-y-6">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`border border-border/50 shadow-sm ${notification.read ? 'bg-muted/30' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className={`mr-2 h-4 w-4 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                {notification.title}
                {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>}
              </CardTitle>
              <CardDescription>{notification.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notification.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Check className="mr-2 h-4 w-4" />
                Mark as Read
              </Button>
              <Button variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

