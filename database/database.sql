// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table Users [note: 'managed by Asp.Identity service']{
  UserID varchar [pk]
  Username varchar
  SubscriptionID int [default: null]
  Notes varchar [note: 'Additional information about the user']
}

Table Products {
  ProductID int [pk]
  Product varchar(255)
  IsAvailable bit [not null, default: 0]
  Description varchar(MAX) [default: 'NULL']
}

// economico
// standard
// luxury
Table Packages {
  PackageID int [pk]
  InsertDate datetime
  LastUpdateDate datetime
  SubscriptionID int
  PackagingID int
}

// many-to-many table 
Table ProductsPackages {
  PackageID int [pk]
  ProductID int [pk]
}

// legno
// alluminio anodizzato
// inox laserato
// ottone
// inox cnc
// Argento
Table Materials {
  MaterialID int [pk]
  Material varchar(255) [unique, not null]
  Description varchar(MAX) [default: 'NULL']
}

Table PackageMaterials {
  PackageID int [pk]
  MaterialID int [pk]
}

// sacchettino in tessuto
// box in legno laserato
// BOX STAMPATO IN 3D
Table Packaging {
  PackagingID int [pk]
  Package varchar(255) [unique, not null]
  Description varchar(MAX) [default: 'NULL']
}

// osso
// tondo
// rettangolare
Table Forms {
  FormID int [pk]
  Form varchar(255) [unique, not null]
}

// s
// m
Table Sizes {
  SizeID int [pk]
  Size varchar(5) [unique, not null]
}

Table Colors {
  ColorID int [pk]
  Color varchar(255) [unique, not null]
  RGBCode varchar(20) [unique, not null]
  HEXCode varchar(10) [unique, not null]
}


Table Subscription {
  SubscriptionID int [pk]
  Duration datetime [not null]
}

Table MaterialColors {
  MaterialID int [pk]
  ColorID int [pk]
}

Table ProductForms {
  ProductID int [pk]
  FormID int [pk]
}

Table ProductSizes {
  ProductID int [pk]
  SizeID int [pk]
}

Table ShoppingCart {
  ProductID int [pk]
  UserID varchar(455) [pk]
}

Table Orders {
  ProductID int [pk]
  UserID varchar(455) [pk]
  IsPaid bit [not null, default: 1]
  TotalAmount decimal [not null]
  CreationDate datetime [not null]
  LastUpdateDate datetime [not null]
  StatusID int [not null]
}

// sent
// on delivery
// delivered
Table Statuses {
  StatusID int
  Status varchar(32) [unique, not null]


Ref: "ProductsPackages"."PackageID" < "Products"."ProductID"

Ref: "ProductsPackages"."ProductID" < "Packages"."PackageID"

Ref: "PackageMaterials"."PackageID" < "Packages"."PackageID"

Ref: "PackageMaterials"."MaterialID" < "Materials"."MaterialID"

Ref: "Packages"."SubscriptionID" < "Subscription"."SubscriptionID"

Ref: "Packages"."PackagingID" < "Packaging"."PackagingID"

Ref: "ProductForms"."FormID" < "Forms"."FormID"

Ref: "ProductForms"."ProductID" < "Products"."ProductID"

Ref: "ProductSizes"."ProductID" < "Products"."ProductID"

Ref: "ProductSizes"."SizeID" < "Sizes"."SizeID"

Ref: "ShoppingCart"."UserID" < "Users"."UserID"

Ref: "ShoppingCart"."ProductID" < "Products"."ProductID"

Ref: "Users"."SubscriptionID" < "Subscription"."SubscriptionID"

Ref: "MaterialColors"."MaterialID" < "Materials"."MaterialID"

Ref: "MaterialColors"."ColorID" < "Colors"."ColorID"

Ref: "Orders"."ProductID" < "Products"."ProductID"

Ref: "Orders"."UserID" < "Users"."UserID"

Ref: "Orders"."StatusID" < "Statuses"."Status"