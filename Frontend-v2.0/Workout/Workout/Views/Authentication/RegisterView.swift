import SwiftUI

struct RegisterView: View {
    @State private var email = ""
    @State private var username = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage: String?
    @State private var showAlert = false

    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
                VStack(spacing: 20) {
                    Text("Create Account")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.top, 50)

                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)

                    TextField("Username", text: $username)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)
                        .autocapitalization(.none)

                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)

                    SecureField("Confirm Password", text: $confirmPassword)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)

                    if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding(.horizontal, 20)
                    }

                    Button(action: {
                        NetworkManager.shared.register(username: username, email: email, password: password, confirmPassword: confirmPassword) { result in
                            switch result {
                            case .success:
                                showAlert = true
                            case .failure(let error):
                                errorMessage = error.localizedDescription
                            }
                        }
                    }) {
                        Text("Register")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.green)
                            .cornerRadius(10)
                            .padding(.horizontal, 20)
                    }.alert(isPresented: $showAlert) {
                        Alert(title: Text("Registration Successful"), message: Text("You can now login"), dismissButton: .default(Text("OK")))
                    }
                }
                Spacer()
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .background(Color(.systemGray6))
            .edgesIgnoringSafeArea(.all)
        }
    }
}
