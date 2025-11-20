import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Address, CreateAddress, createAddressSchema, UpdateAddress, updateAddressSchema } from "@/types";

import {
  addAddress,
  updateAddress,
  deleteAddress as deleteAddressAction,
  setAddresses,
} from "@/store/slices/address";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";

import { MapPin, Edit, Trash, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Addresses() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const { items: addresses } = useAppSelector((state) => state.address);

  const [editing, setEditing] = useState<Address | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await addressService.getMyAddresses({ page: 1, limit: 50 });
      if (res?.data?.addresses?.length > 0) {
        dispatch(setAddresses(res.data.addresses));
      }
      return res?.data?.addresses ?? [];
    },
    enabled: addresses.length === 0,
  });

  const addMutation = useMutation({
    mutationFn: async (payload: CreateAddress) =>
      await addressService.create(payload),
    onSuccess: ({ data, message }) => {
      toast.success(message ?? "Address added");
      qc.invalidateQueries({ queryKey: ["addresses"] });
      dispatch(addAddress(data));
      // explicitly reset to empty values so previous inputs don't persist
      form.reset(emptyAddress);
      setOpenForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to add address");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateAddress) =>
      await addressService.update(editing!._id, payload),
    onSuccess: ({ data, message }) => {
      toast.success(message ?? "Address updated");
      qc.invalidateQueries({ queryKey: ["addresses"] });
      dispatch(updateAddress({ data, id: editing!._id }));
      setEditing(null);
      // clear the form to defaults after update
      form.reset(emptyAddress);
      setOpenForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to update address");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await addressService.delete(id),
    onSuccess: ({ data, message }) => {
      toast.success(message ?? "Address removed");
      qc.invalidateQueries({ queryKey: ["addresses"] });
      const deletedId = data?._id;
      dispatch(deleteAddressAction(deletedId));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to delete address");
    },
  });

  const form = useForm<CreateAddress | UpdateAddress>({
    resolver: zodResolver(editing ? updateAddressSchema : createAddressSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  const emptyAddress: CreateAddress = {
    fullname: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  };

  useEffect(() => {
    if (data && data.length > 0 && addresses.length === 0) {
      dispatch(setAddresses(data));
    }
  }, [data]);

  const onEdit = (addr: Address) => {
    setEditing(addr);
    setOpenForm(true);
    form.reset({
      fullname: addr.fullname,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* title */}
      <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>


      {(openForm && !editing) ? (
        <Card className="shadow-sm border border-gray-200 mb-6">
          <CardHeader className="bg-[#F5F8FF] border-b border-gray-200 p-4">
            <CardTitle className="text-sm font-semibold text-accent uppercase">
              ADD A NEW ADDRESS
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => addMutation.mutate(values))} className="space-y-4">
                {/* Full name */}
                <FormField
                  name="fullname"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10-digit mobile number"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pincode */}
                <FormField
                  name="postalCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="Pincode" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Locality */}
                <FormField
                  name="line2"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locality</FormLabel>
                      <FormControl>
                        <Input placeholder="Locality" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address line */}
                <FormField
                  name="line1"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Area & Street)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Area, Street, Sector, Village"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/District/Town</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* actions */}
                <div className="flex gap-4 mt-4">
                  <Button
                    type="submit"
                    className="px-10 h-12"
                    disabled={addMutation.isPending || updateMutation.isPending}
                  >
                    {editing ? (updateMutation.isPending ? "Saving..." : "Save") : (addMutation.isPending ? "Adding..." : "Save")}
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12"
                    type="button"
                    onClick={() => {
                      // ensure form cleared on cancel
                      form.reset(emptyAddress);
                      setEditing(null);
                      setOpenForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>) :
        <div
          className="flex items-center gap-2 text-accent font-medium text-sm cursor-pointer mb-4 select-none"
          onClick={(e) => {
            e.preventDefault();
            form.reset(emptyAddress);
            setEditing(null);
            setOpenForm(true);
          }}
        >
          <span className="text-xl leading-none">+</span>
          <span>ADD A NEW ADDRESS</span>
        </div>
      }
      {/* address list */}
      <div className="space-y-4">
        {isPending && (
          <Card>
            <CardContent className="p-6">Loading...</CardContent>
          </Card>
        )}

        {!isPending && addresses.length === 0 && (
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              No saved addresses.
            </CardContent>
          </Card>
        )}

        {addresses.map((addr) => (
          <Card key={addr._id} className="shadow-sm border border-gray-200">
            {(openForm && editing?._id === addr._id) ? (
              <Card className="shadow-sm border border-gray-200 mb-6">
                <CardHeader className="bg-[#F5F8FF] border-b border-gray-200 p-4">
                  <CardTitle className="text-sm font-semibold text-accent uppercase">
                    EDIT ADDRESS
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))} className="space-y-4">
                      {/* Full name */}
                      <FormField
                        name="fullname"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone */}
                      <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10-digit mobile number"
                                {...field}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pincode */}
                      <FormField
                        name="postalCode"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="Pincode" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Locality */}
                      <FormField
                        name="line2"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Locality</FormLabel>
                            <FormControl>
                              <Input placeholder="Locality" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Address line */}
                      <FormField
                        name="line1"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Area & Street)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Area, Street, Sector, Village"
                                {...field}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* City */}
                      <FormField
                        name="city"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/District/Town</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* State */}
                      <FormField
                        name="state"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Country */}
                      <FormField
                        name="country"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="India" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* actions */}
                      <div className="flex gap-4 mt-4">
                        <Button
                          type="submit"
                          className="px-10 h-12"
                          disabled={addMutation.isPending || updateMutation.isPending}
                        >
                          {editing ? (updateMutation.isPending ? "Saving..." : "Save") : (addMutation.isPending ? "Adding..." : "Save")}
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12"
                          type="button"
                          onClick={() => {
                            // clear and close edit form
                            form.reset(emptyAddress);
                            setEditing(null);
                            setOpenForm(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) :
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-base">
                          {addr.fullname} &nbsp; <span className="text-sm font-normal">{addr.phone}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                          , {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>, {addr.country}
                        </p>
                      </div>

                      {/* 3-dots menu */}
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-gray-100">
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                onEdit(addr);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Edit
                              </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onSelect={(e: any) => {
                                e.preventDefault();
                                // confirm before delete
                                if (confirm("Delete this address?")) {
                                  deleteMutation.mutate(addr._id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 text-destructive">
                                <Trash className="w-4 h-4" /> Delete
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            }
          </Card>
        ))}
      </div>
    </div>
  );
}
