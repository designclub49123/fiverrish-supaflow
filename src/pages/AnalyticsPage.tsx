
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState } from "react";

const revenueData = [
  { name: 'Jan', revenue: 1500 },
  { name: 'Feb', revenue: 2300 },
  { name: 'Mar', revenue: 4100 },
  { name: 'Apr', revenue: 3200 },
  { name: 'May', revenue: 5400 },
  { name: 'Jun', revenue: 6200 },
];

const ordersData = [
  { name: 'Jan', orders: 12 },
  { name: 'Feb', orders: 19 },
  { name: 'Mar', orders: 31 },
  { name: 'Apr', orders: 25 },
  { name: 'May', orders: 42 },
  { name: 'Jun', orders: 49 },
];

const servicePerformanceData = [
  { name: 'Logo Design', value: 40 },
  { name: 'Web Development', value: 30 },
  { name: 'Content Writing', value: 20 },
  { name: 'Digital Marketing', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("6m");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="1m">Last month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Revenue</CardTitle>
            <CardDescription>Revenue earned from all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$22,700</div>
            <p className="text-sm text-green-500 flex items-center">
              +12.5% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Orders Completed</CardTitle>
            <CardDescription>Total completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">178</div>
            <p className="text-sm text-green-500 flex items-center">
              +8.2% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Average Rating</CardTitle>
            <CardDescription>Average rating from all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8/5</div>
            <p className="text-sm text-green-500 flex items-center">
              +0.3 from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="services">Service Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Monthly revenue for the past six months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>
                Monthly orders for the past six months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ordersData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>
                Revenue distribution by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={servicePerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {servicePerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
            <CardDescription>
              Services with the highest revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Logo Design Premium</span>
                <span className="font-bold">$6,800</span>
              </div>
              <div className="flex justify-between">
                <span>Website Development</span>
                <span className="font-bold">$5,200</span>
              </div>
              <div className="flex justify-between">
                <span>SEO Optimization</span>
                <span className="font-bold">$3,900</span>
              </div>
              <div className="flex justify-between">
                <span>Content Writing</span>
                <span className="font-bold">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span>Social Media Management</span>
                <span className="font-bold">$1,800</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Demographics</CardTitle>
            <CardDescription>
              Where your clients are from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>United States</span>
                <span className="font-bold">42%</span>
              </div>
              <div className="flex justify-between">
                <span>United Kingdom</span>
                <span className="font-bold">18%</span>
              </div>
              <div className="flex justify-between">
                <span>Canada</span>
                <span className="font-bold">12%</span>
              </div>
              <div className="flex justify-between">
                <span>Australia</span>
                <span className="font-bold">9%</span>
              </div>
              <div className="flex justify-between">
                <span>Germany</span>
                <span className="font-bold">7%</span>
              </div>
              <div className="flex justify-between">
                <span>Others</span>
                <span className="font-bold">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
