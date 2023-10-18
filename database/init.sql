-- Create the AnimalSources table to store both breeders and rescues
CREATE TABLE AnimalSources (
    SourceID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT,
    PhoneNumber TEXT,
    Type TEXT NOT NULL,
    EthicsState TEXT NOT NULL,
    Country TEXT,
    Coordinates TEXT,
    LogoBase64 TEXT,
    Website TEXT,
    Description TEXT,
    OtherValuesJSON TEXT,
    Animal TEXT
);

-- Create the Accounts table to store user accounts
CREATE TABLE Accounts (
    AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    PasswordSalt TEXT NOT NULL
);

-- Create the Rights table to associate users with rights
CREATE TABLE Rights (
    RightID INTEGER PRIMARY KEY AUTOINCREMENT,
    AccountID INTEGER NOT NULL,
    RightText TEXT NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- Create an index for faster searches
CREATE INDEX IF NOT EXISTS idx_source_name ON AnimalSources(Name);
CREATE INDEX IF NOT EXISTS idx_account_username ON Accounts(Username);