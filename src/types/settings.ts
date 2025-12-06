export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Setting {
  _id?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  socialLinks?: SocialLinks;
  aboutTitle?: string;
  aboutDescription?: string;
  yearsOfExperience?: string;
  happyCustomers?: string;
  productsAvailable?: string;
  citiesServed?: string;
  workingHours?: string;
  whyChooseUs?: string;
  createdAt?: string;
  updatedAt?: string;
}

