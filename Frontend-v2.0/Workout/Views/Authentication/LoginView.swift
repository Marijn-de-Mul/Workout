import SwiftUI

struct LoginView: View {
    @Binding var isLoggedIn: Bool
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    @State private var showRegister = false

    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
                VStack(spacing: 20) {
                    Text("Welcome Back")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.top, 50)

                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)

                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 20)

                    if let errorMessage = errorMessage {
                        Text("Login Failed: \(errorMessage)")
                            .foregroundColor(.red)
                            .fontWeight(.bold)
                            .padding(.horizontal, 20)
                            .multilineTextAlignment(.center)
                    }

                    Button(action: {
                        UserManager.shared.login(email: email, password: password) { result in
                            DispatchQueue.main.async {
                                switch result {
                                case .success:
                                    isLoggedIn = true
                                case .failure(let error):
                                    errorMessage = error.localizedDescription
                                }
                            }
                        }
                    }) {
                        Text("Login")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .cornerRadius(10)
                            .padding(.horizontal, 20)
                    }

                    Button(action: {
                        showRegister = true
                    }) {
                        Text("Register")
                            .font(.headline)
                            .foregroundColor(.blue)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color.blue, lineWidth: 2)
                            )
                            .padding(.horizontal, 20)
                    }
                    .sheet(isPresented: $showRegister) {
                        RegisterView()
                    }
                }
                Spacer()
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .background(Color(.systemGray6))
        }
    }
}
