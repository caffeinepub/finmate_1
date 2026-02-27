import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type ColorMode = {
    #light;
    #dark;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
    referralCode : Text;
    digiPointsReward : Nat;
    colorMode : ColorMode;
    displayName : Text;
    isAnonymous : Bool;
    walletBalance : Nat;
  };

  type TransactionType = {
    #debit;
    #credit;
  };

  type TransactionCategory = {
    #food;
    #clothing;
    #college;
    #travel;
    #entertainment;
    #utilities;
    #shopping;
    #groceries;
    #health;
    #transportation;
    #other;
  };

  type Transaction = {
    id : Text;
    userId : Text;
    amount : Float;
    transactionType : TransactionType;
    category : TransactionCategory;
    merchantName : Text;
    date : Time.Time;
    bankAccountId : Text;
    createdAt : Time.Time;
  };

  type BankAccount = {
    id : Text;
    userId : Text;
    bankName : Text;
    accountNumber : Text;
    accountType : Text;
    balance : Float;
    createdAt : Time.Time;
  };

  type Challenge = {
    id : Text;
    title : Text;
    description : Text;
    category : TransactionCategory;
    targetAmount : Float;
    digiPointsReward : Nat;
    durationDays : Nat;
  };

  type Feedback = {
    id : Nat;
    rating : Nat;
    message : Text;
    submittedBy : Principal;
    timestamp : Time.Time;
  };

  type SupportTicket = {
    id : Nat;
    subject : Text;
    description : Text;
    raisedBy : Principal;
    timestamp : Time.Time;
  };

  type LeaderboardEntry = {
    principal : Principal;
    displayName : Text;
    digiPointsReward : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Principal, List.List<Transaction>>();
  let bankAccounts = Map.empty<Principal, List.List<BankAccount>>();
  let challenges = Map.empty<Text, Challenge>();
  let feedbacks = Map.empty<Nat, Feedback>();
  let supportTickets = Map.empty<Nat, SupportTicket>();

  var nextFeedbackId = 0;
  var nextTicketId = 0;

  // ── Profile Management ──────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ── Bank Account Management ─────────────────────────────────────────────────

  public shared ({ caller }) func addBankAccount(account : BankAccount) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add bank accounts");
    };
    let existing = switch (bankAccounts.get(caller)) {
      case (null) { List.empty<BankAccount>() };
      case (?accounts) { accounts };
    };
    existing.add(account);
    bankAccounts.add(caller, existing);
  };

  public query ({ caller }) func getBankAccounts() : async [BankAccount] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view bank accounts");
    };
    switch (bankAccounts.get(caller)) {
      case (null) { [] };
      case (?accounts) { accounts.toArray() };
    };
  };

  public shared ({ caller }) func removeBankAccount(accountId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove bank accounts");
    };
    switch (bankAccounts.get(caller)) {
      case (null) { () };
      case (?accounts) {
        let updated = accounts.filter(func(a : BankAccount) : Bool { a.id != accountId });
        bankAccounts.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func updateBalance(accountId : Text, newBalance : Float) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update bank account balances");
    };
    switch (bankAccounts.get(caller)) {
      case (null) { () };
      case (?accounts) {
        let updated = accounts.map<BankAccount, BankAccount>(func(a : BankAccount) : BankAccount {
          if (a.id == accountId) {
            { id = a.id; userId = a.userId; bankName = a.bankName; accountNumber = a.accountNumber; accountType = a.accountType; balance = newBalance; createdAt = a.createdAt };
          } else { a };
        });
        bankAccounts.add(caller, updated);
      };
    };
  };

  // ── Transaction Management ──────────────────────────────────────────────────

  public shared ({ caller }) func addTransaction(transaction : Transaction) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };
    let existing = switch (transactions.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?txs) { txs };
    };
    existing.add(transaction);
    transactions.add(caller, existing);
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?txs) {
        txs.toArray().sort(func(t1 : Transaction, t2 : Transaction) : Order.Order {
          switch (Int.compare(t2.date, t1.date)) {
            case (#equal) { Text.compare(t1.merchantName, t2.merchantName) };
            case (order) { order };
          };
        });
      };
    };
  };

  public query ({ caller }) func getTransactionsByCategory(category : TransactionCategory) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?txs) {
        txs.filter(func(t : Transaction) : Bool { t.category == category }).toArray();
      };
    };
  };

  public query ({ caller }) func getTransactionsByDateRange(startDate : Time.Time, endDate : Time.Time) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?txs) {
        txs.filter(func(t : Transaction) : Bool {
          t.date >= startDate and t.date <= endDate;
        }).toArray();
      };
    };
  };

  // ── Challenge Management ────────────────────────────────────────────────────

  public query ({ caller }) func getChallenges() : async [Challenge] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view challenges");
    };
    challenges.values().toArray();
  };

  public shared ({ caller }) func addChallenge(challenge : Challenge) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add challenges");
    };
    challenges.add(challenge.id, challenge);
  };

  public shared ({ caller }) func removeChallenge(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove challenges");
    };
    challenges.remove(id);
  };

  // ── Feedback Management ─────────────────────────────────────────────────────

  public shared ({ caller }) func submitFeedback(rating : Nat, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };
    let feedback : Feedback = {
      id = nextFeedbackId;
      rating;
      message;
      submittedBy = caller;
      timestamp = Time.now();
    };
    feedbacks.add(nextFeedbackId, feedback);
    nextFeedbackId += 1;
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };
    feedbacks.values().toArray();
  };

  // ── Support Ticket Management ───────────────────────────────────────────────

  public shared ({ caller }) func submitSupportTicket(subject : Text, description : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit support tickets");
    };
    let ticket : SupportTicket = {
      id = nextTicketId;
      subject;
      description;
      raisedBy = caller;
      timestamp = Time.now();
    };
    supportTickets.add(nextTicketId, ticket);
    nextTicketId += 1;
  };

  public query ({ caller }) func getAllSupportTickets() : async [SupportTicket] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all support tickets");
    };
    supportTickets.values().toArray();
  };

  // ── Leaderboard Management ──────────────────────────────────────────────────

  public shared ({ caller }) func updateLeaderboardPreferences(displayName : Text, isAnonymous : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update leaderboard preferences");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        let updatedProfile = {
          name = profile.name;
          email = profile.email;
          avatarUrl = profile.avatarUrl;
          createdAt = profile.createdAt;
          referralCode = profile.referralCode;
          digiPointsReward = profile.digiPointsReward;
          colorMode = profile.colorMode;
          displayName;
          isAnonymous;
          walletBalance = profile.walletBalance;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Returns a single leaderboard entry for a given user, masking the display
  // name when the user has opted into anonymous mode. No auth required since
  // leaderboard data is intentionally public, but the real display name is
  // never revealed when isAnonymous is true.
  public query func getLeaderboardEntry(user : Principal) : async ?{ displayName : Text; digiPointsReward : Nat } {
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) {
        let name = if (profile.isAnonymous) { "Anonymous" } else { profile.displayName };
        ?{ displayName = name; digiPointsReward = profile.digiPointsReward };
      };
    };
  };

  // Returns all leaderboard entries, respecting the anonymous flag.
  // No auth required since leaderboard data is intentionally public.
  public query func getLeaderboard() : async [LeaderboardEntry] {
    let entries = List.empty<LeaderboardEntry>();
    for ((principal, profile) in userProfiles.entries()) {
      let name = if (profile.isAnonymous) { "Anonymous" } else { profile.displayName };
      entries.add({
        principal;
        displayName = name;
        digiPointsReward = profile.digiPointsReward;
      });
    };
    let arr = entries.toArray();
    arr.sort(func(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(b.digiPointsReward, a.digiPointsReward);
    });
  };

  // ── Bank Transfers & Balance Check (Simulated)───────────────────────────────

  public shared ({ caller }) func sendMoney(_ : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send money");
    };
    // Logic is handled on the frontend
  };

  public shared ({ caller }) func checkBalance(_ : Text) : async Float {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check balance");
    };
    switch (bankAccounts.get(caller)) {
      case (null) { 0.0 };
      case (?accounts) {
        accounts.foldLeft<Float, BankAccount>(0.0, func(acc, account) { acc + account.balance });
      };
    };
  };

  // ── Demo Data Seeding ───────────────────────────────────────────────────────

  public shared ({ caller }) func seedDemoData() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };

    let categories : [TransactionCategory] = [
      #food,
      #clothing,
      #college,
      #travel,
      #entertainment,
      #utilities,
      #shopping,
      #groceries,
      #health,
      #transportation,
      #other,
    ];

    let demoTransactions = List.empty<Transaction>();
    let now = Time.now();

    let categoriesIter = categories.values();
    for (category in categoriesIter) {
      let transaction : Transaction = {
        id = "1-" # debug_show (category);
        userId = "demo";
        amount = 100.0;
        transactionType = #debit;
        category;
        merchantName = "Sample " # debug_show (category);
        date = now;
        bankAccountId = "DEMO_1";
        createdAt = now;
      };
      demoTransactions.add(transaction);
    };

    let demoPrincipal = Principal.fromText("2vxsx-fae");
    transactions.add(demoPrincipal, demoTransactions);

    let accountList = List.singleton<BankAccount>({
      id = "DEMO_1";
      userId = "demo";
      bankName = "Demo Bank";
      accountNumber = "****5678";
      accountType = "Checking";
      balance = 5000.0;
      createdAt = now;
    });
    bankAccounts.add(demoPrincipal, accountList);

    let challenge : Challenge = {
      id = "DEMO_CHALLENGE";
      title = "Travel Savings";
      description = "Travel Savings Goal";
      category = #travel;
      targetAmount = 1000.0;
      digiPointsReward = 100;
      durationDays = 30;
    };
    challenges.add("DEMO_CHALLENGE", challenge);
  };
};
