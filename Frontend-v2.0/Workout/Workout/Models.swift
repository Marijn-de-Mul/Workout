import Foundation

// User model

struct UserInfo: Codable {
    let username: String
    let email: String
}

// Routine model

struct ExerciseResponse: Decodable {
    let id: String
    let values: [Exercise]

    enum CodingKeys: String, CodingKey {
        case id = "$id"
        case values = "$values"
    }
}

struct Exercise: Decodable, Identifiable {
    let id: Int
    let routineId: Int
    let userId: String
    let name: String
    let description: String
    let routine: Routine?
    let exerciseCategories: ExerciseCategories?
}

struct ExerciseCategories: Decodable {
    let values: [ExerciseCategory]

    enum CodingKeys: String, CodingKey {
        case values = "$values"
    }
}

struct ExerciseCategory: Decodable {
    let exerciseId: Int
    let categoryId: Int
}
// Routine model

struct RoutineResponse: Decodable {
    let id: String
    let values: [Routine]

    enum CodingKeys: String, CodingKey {
        case id = "$id"
        case values = "$values"
    }
}

struct RoutineCategories: Decodable {
    let values: [RoutineCategory]

    enum CodingKeys: String, CodingKey {
        case values = "$values"
}

    }
struct RoutineCategory: Decodable {
    let routineId: Int
    let categoryId: Int
}

struct Routine: Decodable, Identifiable {
    let id: Int
    let userId: String
    let name: String
    let description: String
    let routineCategories: RoutineCategories?
}

// Category model

struct Category: Identifiable, Codable {
    var id: Int
    var name: String
    var type: String
}

struct CategoriesResponse: Decodable {
    let values: [Category]

    enum CodingKeys: String, CodingKey {
        case values = "$values"
    }
}
