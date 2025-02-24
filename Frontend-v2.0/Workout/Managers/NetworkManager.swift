import Foundation

class NetworkManager {
    static let shared = NetworkManager()

    private init() {}

    private let baseUrl = "https://backend.wo.marijndemul.nl"
    public var authToken: String?

    func setAuthToken(_ token: String?) {
        self.authToken = token
    }

    private func createRequest(endpoint: String, method: String, body: [String: Any]? = nil) -> URLRequest {
        let url = URL(string: "\(baseUrl)\(endpoint)")!
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        }
        
        return request
    }
    
    func login(email: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
        let body: [String: Any] = ["email": email, "password": password]
        let request = createRequest(endpoint: "/api/Auth/login", method: "POST", body: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            if let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let token = json["token"] as? String {
                self.setAuthToken(token)
                completion(.success(true))
            } else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
            }
        }.resume()
    }
    
    func register(username: String, email: String, password: String, confirmPassword: String, completion: @escaping (Result<Bool, Error>) -> Void) {
        let body: [String: Any] = ["username": username, "email": email, "password": password, "confirmPassword": confirmPassword]
        let request = createRequest(endpoint: "/api/Auth/register", method: "POST", body: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            completion(.success(true))
        }.resume()
    }
    
    func getUserInfo(completion: @escaping (Result<UserInfo, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Auth/me", method: "GET")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            if let data = data {
                do {
                    let userInfo = try JSONDecoder().decode(UserInfo.self, from: data)
                    completion(.success(userInfo))
                } catch {
                    completion(.failure(error))
                }
            } else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
            }
        }.resume()
    }
    
    func addCategory(_ name: String, desc: String, type: String, completion: @escaping (Result<Category, Error>) -> Void) {
        let body: [String: Any] = ["name": name, "description": desc, "type": type]
        let request = createRequest(endpoint: "/api/Category", method: "POST", body: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let addedItem = try JSONDecoder().decode(Category.self, from: data)
                completion(.success(addedItem))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchCategories(completion: @escaping (Result<[Category], Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Category", method: "GET")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let response = try JSONDecoder().decode(CategoriesResponse.self, from: data)
                completion(.success(response.values))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func deleteCategory(_ categoryId: Int, completion: @escaping (Result<Void, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Category/\(categoryId)", method: "DELETE")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            completion(.success(()))
        }.resume()
    }
    
    func addExercise(name: String, desc: String, categoryId: Int, routineId: Int, completion: @escaping (Result<Exercise, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Exercise", method: "POST", body: ["name": name, "description": desc, "categoryId": categoryId, "routineId": routineId])
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let exercise = try JSONDecoder().decode(Exercise.self, from: data)
                completion(.success(exercise))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func getExercises(completion: @escaping (Result<[Exercise], Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Exercise", method: "GET")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            if let data = data {
                do {
                    let exerciseResponse = try JSONDecoder().decode(ExerciseResponse.self, from: data)
                    completion(.success(exerciseResponse.values))
                } catch {
                    completion(.failure(error))
                }
            } else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
            }
        }.resume()
    }
    
    func deleteExercise(id: Int, completion: @escaping (Result<Void, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Exercise/\(id)", method: "DELETE")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            completion(.success(()))
        }.resume()
    }
    
    func getRoutines(completion: @escaping (Result<[Routine], Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Routine", method: "GET")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let routineResponse = try JSONDecoder().decode(RoutineResponse.self, from: data)
                completion(.success(routineResponse.values))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func addRoutine(name: String, desc: String, categoryId: Int, completion: @escaping (Result<Routine, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Routine", method: "POST", body: ["name": name, "description": desc, "categoryId": categoryId])
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let routine = try JSONDecoder().decode(Routine.self, from: data)
                completion(.success(routine))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func deleteRoutine(id: Int, completion: @escaping (Result<Void, Error>) -> Void) {
        let request = createRequest(endpoint: "/api/Routine/\(id)", method: "DELETE")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            completion(.success(()))
        }.resume()
    }
}
