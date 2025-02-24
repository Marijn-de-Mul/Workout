import SwiftUI

struct ManageRoutinesView: View {
    @State private var routines: [Routine] = []
    @State private var errorMessage: String?

    var body: some View {
        List {
            ForEach(routines) { routine in
                HStack {
                    Text(routine.name)
                    Spacer()
                    Button(action: {
                        deleteRoutine(routine)
                    }) {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                    }
                }
            }
        }
        .navigationTitle("Manage Routines")
        .onAppear {
            fetchRoutines()
        }
    }

    private func fetchRoutines() {
        NetworkManager.shared.getRoutines { result in
            switch result {
            case .success(let routines):
                DispatchQueue.main.async {
                    self.routines = routines
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func deleteRoutine(_ routine: Routine) {
        NetworkManager.shared.deleteRoutine(id: routine.id) { result in
            switch result {
            case .success:
                DispatchQueue.main.async {
                    self.routines.removeAll { $0.id == routine.id }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
