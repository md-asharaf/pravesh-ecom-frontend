import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Wallet, Package, Heart, User, LogOut, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.img} alt={user.name} />
                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/dashboard">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/wishlist">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive" asChild>
                    <Link to="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

            {/* Wallet Card */}
            <Card className="mb-8 bg-gradient-hero">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 mb-2">Wallet Balance</p>
                    <h2 className="text-4xl font-bold text-primary-foreground">
                      ₹{user.wallet.toLocaleString()}
                    </h2>
                  </div>
                  <Wallet className="h-16 w-16 text-primary-foreground/50" />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" size="sm">
                    Add Money
                  </Button>
                  <Button variant="outline" size="sm" className="bg-background/10 border-primary-foreground text-primary-foreground hover:bg-background/20">
                    Transaction History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
                      <h3 className="text-3xl font-bold">{orders.length}</h3>
                    </div>
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Total Spent</p>
                      <h3 className="text-3xl font-bold">
                        ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-10 w-10 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Wishlist Items</p>
                      <h3 className="text-3xl font-bold">4</h3>
                    </div>
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>*/}

            {/* Orders */}
            {/*<Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.items.map((product) => (
                          <div key={product.id} className="flex items-center gap-4">
                            <img
                              src={product.thumb}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <Link to={`/product/${product.slug}`} className="font-semibold hover:text-primary">
                                {product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">₹{product.final.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total: ₹{order.total.toLocaleString()}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          {order.status === "delivered" && (
                            <Button size="sm">Buy Again</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="processing">
                {orders.filter(o => o.status === "processing").map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">Order #{order.id} - Processing</CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="shipped">
                {orders.filter(o => o.status === "shipped").map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">Order #{order.id} - Shipped</CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="delivered">
                {orders.filter(o => o.status === "delivered").map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">Order #{order.id} - Delivered</CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
