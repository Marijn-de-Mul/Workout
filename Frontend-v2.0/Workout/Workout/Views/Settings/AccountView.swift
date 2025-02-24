import SwiftUI

struct AccountView: View {
    @State private var userInfo: UserInfo?
    @State private var errorMessage: String?
    @Binding var isLoggedIn: Bool

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.circle.fill")
                .resizable()
                .frame(width: 100, height: 100)
                .foregroundColor(.blue)
                .padding(.top, 40)

            Text("Account Information")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.horizontal)
                .multilineTextAlignment(.center)

            if let userInfo = userInfo {
                VStack(spacing: 10) {
                    Text("Username: \(userInfo.username)")
                        .font(.title2)
                        .padding(.horizontal)
                    Text("Email: \(userInfo.email)")
                        .font(.title2)
                        .padding(.horizontal)
                }
            } else if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding(.horizontal)
            } else {
                Text("Loading...")
                    .padding(.horizontal)
            }

            Spacer()

            Button(action: {
                UserManager.shared.logout()
                isLoggedIn = false
            }) {
                Text("Logout")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.red)
                    .cornerRadius(10)
                    .padding(.horizontal)
            }
        }
        .padding()
        .background(Color(.systemGroupedBackground))
        .onAppear {
            NetworkManager.shared.getUserInfo { result in
                switch result {
                case .success(let userInfo):
                    self.userInfo = userInfo
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                }
            }
        }
        .navigationTitle("Account")
    }
}
