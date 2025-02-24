import SwiftUI

struct ManageExercisesView: View {
    @State private var exercises: [Exercise] = []
    @State private var errorMessage: String?

    var body: some View {
        List {
            ForEach(exercises) { exercise in
                HStack {
                    Text(exercise.name)
                    Spacer()
                    Button(action: {
                        deleteExercise(exercise)
                    }) {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                    }
                }
            }
        }
        .navigationTitle("Manage Exercises")
        .onAppear {
            fetchExercises()
        }
    }

    private func fetchExercises() {
        NetworkManager.shared.getExercises { result in
            switch result {
            case .success(let exercises):
                DispatchQueue.main.async {
                    self.exercises = exercises
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func deleteExercise(_ exercise: Exercise) {
        NetworkManager.shared.deleteExercise(id: exercise.id) { result in
            switch result {
            case .success:
                DispatchQueue.main.async {
                    self.exercises.removeAll { $0.id == exercise.id }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
