#include <bits/stdc++.h>
using namespace std;

void solve(){
    int n,i,sum = 0, count = 0;
    cin>>n;

    while(n--){
        cin>>i;
        sum+= i; count+= (i==1);
    }
    if(sum %2 == 0){
        if(sum%4 == 0 || (sum/2 % 2 == 1 && count > 1)){
            cout<<"YES\n";
        }
        else{
            cout<<"NO\n";
        }
    }
    else{
        cout<<"NO\n";
    }
}

int main() {
    int t; cin>>t;
    while(t--){
        solve();
    }
}