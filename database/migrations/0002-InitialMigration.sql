-- Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Product VARCHAR(255),
    IsAvailable BIT NOT NULL DEFAULT 0,
    Description VARCHAR(MAX) DEFAULT NULL
);

-- Packages Table
CREATE TABLE Packages (
    PackageID INT PRIMARY KEY IDENTITY(1,1),
    InsertDate DATETIME,
    LastUpdateDate DATETIME,
    SubscriptionID INT,
    PackagingID INT
);

-- ProductsPackages Table (Many-to-many)
CREATE TABLE ProductsPackages (
    PackageID INT,
    ProductID INT,
    PRIMARY KEY (PackageID, ProductID),
    FOREIGN KEY (PackageID) REFERENCES Packages(PackageID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Materials Table
CREATE TABLE Materials (
    MaterialID INT PRIMARY KEY IDENTITY(1,1),
    Material VARCHAR(255) UNIQUE NOT NULL,
    Description VARCHAR(MAX) DEFAULT NULL
);

-- PackageMaterials Table (Many-to-many)
CREATE TABLE PackageMaterials (
    PackageID INT,
    MaterialID INT,
    PRIMARY KEY (PackageID, MaterialID),
    FOREIGN KEY (PackageID) REFERENCES Packages(PackageID),
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID)
);

-- Packaging Table
CREATE TABLE Packaging (
    PackagingID INT PRIMARY KEY IDENTITY(1,1),
    Package VARCHAR(255) UNIQUE NOT NULL,
    Description VARCHAR(MAX) DEFAULT NULL
);

-- Forms Table
CREATE TABLE Forms (
    FormID INT PRIMARY KEY IDENTITY(1,1),
    Form VARCHAR(255) UNIQUE NOT NULL
);

-- Sizes Table
CREATE TABLE Sizes (
    SizeID INT PRIMARY KEY IDENTITY(1,1),
    Size VARCHAR(5) UNIQUE NOT NULL
);

-- Colors Table
CREATE TABLE Colors (
    ColorID INT PRIMARY KEY IDENTITY(1,1),
    Color VARCHAR(255) UNIQUE NOT NULL,
    RGBCode VARCHAR(20) UNIQUE NOT NULL,
    HEXCode VARCHAR(10) UNIQUE NOT NULL
);

-- Subscription Table
CREATE TABLE Subscription (
    SubscriptionID INT PRIMARY KEY IDENTITY(1,1),
    Duration DATETIME NOT NULL
);

-- MaterialColors Table (Many-to-many)
CREATE TABLE MaterialColors (
    MaterialID INT,
    ColorID INT,
    PRIMARY KEY (MaterialID, ColorID),
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID),
    FOREIGN KEY (ColorID) REFERENCES Colors(ColorID)
);

-- ProductForms Table (Many-to-many)
CREATE TABLE ProductForms (
    ProductID INT,
    FormID INT,
    PRIMARY KEY (ProductID, FormID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (FormID) REFERENCES Forms(FormID)
);

-- ProductSizes Table (Many-to-many)
CREATE TABLE ProductSizes (
    ProductID INT,
    SizeID INT,
    PRIMARY KEY (ProductID, SizeID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (SizeID) REFERENCES Sizes(SizeID)
);

-- ShoppingCart Table (many-to-many)
CREATE TABLE ShoppingCart (
    ProductID INT,
    UserID VARCHAR(455),
    PRIMARY KEY (ProductID, UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Orders Table
CREATE TABLE Orders (
    ProductID INT IDENTITY(1,1),
    UserID VARCHAR(455),
    IsPaid BIT NOT NULL DEFAULT 1,
    TotalAmount DECIMAL NOT NULL,
    CreationDate DATETIME NOT NULL,
    LastUpdateDate DATETIME NOT NULL,
    StatusID INT NOT NULL,
    PRIMARY KEY (ProductID, UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (StatusID) REFERENCES Statuses(StatusID)
);

-- Statuses Table
CREATE TABLE Statuses (
    StatusID INT PRIMARY KEY IDENTITY(1,1),
    Status VARCHAR(32) UNIQUE NOT NULL
);

INSERT INTO Materials (Material, Description) VALUES ('legno', NULL);
INSERT INTO Materials (Material, Description) VALUES ('allumigno anodizzato', NULL);
INSERT INTO Materials (Material, Description) VALUES ('inox laserato', NULL);
INSERT INTO Materials (Material, Description) VALUES ('ottone', NULL);
INSERT INTO Materials (Material, Description) VALUES ('inox cnc', NULL);
INSERT INTO Materials (Material, Description) VALUES ('argento', NULL);

INSERT INTO Packaging (Package, Description) VALUES ('sacchetto', 'sacchettino in tessuto');
INSERT INTO Packaging (Package, Description) VALUES ('box', 'box in legno laserato');
INSERT INTO Packaging (Package, Description) VALUES ('box 3d', 'box stampato in 3d');

INSERT INTO Forms (Package, Description) VALUES ('s', NULL);
INSERT INTO Forms (Package, Description) VALUES ('m', NULL);

INSERT INTO Statuses (Status) VALUES ('sent');
INSERT INTO Statuses (Status) VALUES ('on delivery');
INSERT INTO Statuses (Status) VALUES ('delivered');