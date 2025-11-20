import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { ArrowLeft, ArrowRight, Loader2, LogOut } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { EditProfileModal } from "@/components/modals/EditProfile";
// import { ChangePasswordModal } from "@/components/modals/ChangePassword";
import { ChangePhotoModal } from "@/components/modals/ChangeAvatar";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { UpdateUser } from "@/types";
import { Link } from "react-router-dom";
import { Loader } from "@/components/Loader";

const Profile = () => {
  const { user, loading, logout, login } = useAuth();

  const { data: balanceData, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => (await walletService.getBalance()).data,
    enabled: !!user,
  });

  const { data: transactions = [], isLoading: isTxLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => (await walletService.getTransactions()).data,
    enabled: !!user,
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const res = await userService.updatePassword(data.oldPassword, data.newPassword);
      return res.message;
    },
    onSuccess: (message) => {
      toast.success(message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      const res = await userService.update(data);
      return res;
    },
    onSuccess: ({ data, message }) => {
      toast.success(message || "Profile updated successfully");
      login(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  })

  const balance = balanceData?.balance || 0;

  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const paginated = transactions.slice((page - 1) * pageSize, page * pageSize);
  const hasNext = page * pageSize < transactions.length;
  const hasPrev = page > 1;

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

      <div className="col-span-1">
        <Card className="rounded-3xl border-none shadow-sm sticky top-24">
          <CardContent className="p-8 text-center space-y-4">

            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/10">
                <AvatarImage src={user?.img} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <ChangePhotoModal onUpload={(file: any) => updateProfileMutation.mutate({ img: file })} />
            </div>

            <h2 className="text-xl font-bold tracking-tight">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>

            <Separator />

            <EditProfileModal user={user} onSave={updateProfileMutation.mutate} />

            {/* <ChangePasswordModal onChangePassword={changePasswordMutation.mutate} /> */}

            <div className="flex flex-col space-y-4">
              <Link to="/orders">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-xl"
                >
                  Orders
                </Button>
              </Link>

              <Link to="/addresses">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-xl"
                >
                  Addresses
                </Button>
              </Link>

              <Link to="/wishlist">

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-xl"
                >
                  Wishlist
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-xl"
                >
                  Cart
                </Button>
              </Link>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-xl"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 text-red-700" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 lg:col-span-3 space-y-8">

        <Card className="rounded-3xl border-none shadow-sm">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Personal Information
            </h2>
            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-lg font-medium">{user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardContent className="p-8">
            <p className="text-xl font-semibold tracking-tight">Wallet Balance</p>
            <Badge className="text-4xl font-bold mt-2">
              ₹{isBalanceLoading ? "..." : balance.toLocaleString()}
            </Badge>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xl font-semibold tracking-tight">
              Recent Transactions
            </h3>
            <Separator />

            {isTxLoading && <div><Loader2 className="animate-spin" /></div>}
            {!isTxLoading && transactions.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                No transactions found
              </p>
            )}

            <div className="space-y-4">
              {paginated.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 rounded-xl border bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <p
                    className={
                      t.amount > 0
                        ? "text-green-600 font-semibold text-lg"
                        : "text-red-600 font-semibold text-lg"
                    }
                  >
                    ₹{t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="icon"
                disabled={!hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full"
              >
                <ArrowLeft />
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full"
              >
                <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
