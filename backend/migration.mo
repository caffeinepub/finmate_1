import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldUserProfile = {
    name : Text;
    email : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
    referralCode : Text;
    digiPointsReward : Nat;
    colorMode : {
      #light;
      #dark;
    };
    displayName : Text;
    isAnonymous : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    // other actor fields (not changed)
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
    referralCode : Text;
    digiPointsReward : Nat;
    colorMode : {
      #light;
      #dark;
    };
    displayName : Text;
    isAnonymous : Bool;
    walletBalance : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    // other actor fields (not changed)
  };

  public func run(old : OldActor) : NewActor {
    let updatedUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, profile) {
        { profile with walletBalance = 0 };
      }
    );

    { old with userProfiles = updatedUserProfiles };
  };
};
