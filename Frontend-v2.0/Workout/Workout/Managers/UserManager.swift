import Foundation

class UserManager {
    static let shared = UserManager()

    private init() {}

    private let tokenKey = "authToken"

    var authToken: String? {
        get {
            return UserDefaults.standard.string(forKey: tokenKey)
        }
        set {
            UserDefaults.standard.setValue(newValue, forKey: tokenKey)
        }
    }

    func checkTokenValidity(completion: @escaping (Bool) -> Void) {
        guard let token = authToken else {
            completion(false)
            return
        }

        NetworkManager.shared.setAuthToken(token)
        NetworkManager.shared.getUserInfo { result in
            switch result {
            case .success:
                completion(true)
            case .failure(let error):
                if let urlError = error as? URLError, urlError.code == .userAuthenticationRequired {
                    self.authToken = nil
                }
                completion(false)
            }
        }
    }

    func login(email: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
        NetworkManager.shared.login(email: email, password: password) { result in
            switch result {
            case .success:
                self.authToken = NetworkManager.shared.authToken
                completion(.success(true))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }

    func logout() {
        authToken = nil
        NetworkManager.shared.setAuthToken(nil)
    }
}
