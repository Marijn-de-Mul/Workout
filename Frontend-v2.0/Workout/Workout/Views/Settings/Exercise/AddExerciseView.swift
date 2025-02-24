import SwiftUI

struct AddExerciseView: View {
    @State private var exerciseName: String = ""
    @State private var exerciseDesc: String = ""
    @State private var selectedCategory: Category?
    @State private var selectedRoutine: Routine?
    @State private var categories: [Category] = []
    @State private var routines: [Routine] = []
    @State private var errorMessage: String?
    @State private var descType: DescType = .sets
    @State private var sets: String = ""
    @State private var reps: String = ""
    @State private var duration: String = ""
    @State private var durationUnit: DurationUnit = .seconds
    @State private var showAddCategory = false

    enum DescType: String, CaseIterable, Identifiable {
        case sets = "Sets"
        case duration = "Duration"
        case other = "Other"
        var id: String { self.rawValue }
    }

    enum DurationUnit: String, CaseIterable, Identifiable {
        case seconds = "Seconds"
        case minutes = "Minutes"
        var id: String { self.rawValue }
    }

    var body: some View {
        VStack(spacing: 20) {
            TextField("Exercise Name", text: $exerciseName)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Picker("Description Type", selection: $descType) {
                ForEach(DescType.allCases) { type in
                    Text(type.rawValue).tag(type)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            switch descType {
            case .sets:
                HStack {
                    TextField("Sets", text: $sets)
                        .keyboardType(.numberPad)
                        .padding()
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    TextField("Reps", text: $reps)
                        .keyboardType(.numberPad)
                        .padding()
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }
            case .duration:
                HStack {
                    TextField("Duration", text: $duration)
                        .keyboardType(.numberPad)
                        .padding()
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    Picker("Unit", selection: $durationUnit) {
                        ForEach(DurationUnit.allCases) { unit in
                            Text(unit.rawValue).tag(unit)
                        }
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding()
                }
            case .other:
                TextField("Description", text: $exerciseDesc)
                    .padding()
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }

            Menu {
                ForEach(categories) { category in
                    Button(action: {
                        selectedCategory = category
                    }) {
                        Text(category.name)
                    }
                }
            } label: {
                Text(selectedCategory?.name ?? "Select Category")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
            }

            Button(action: {
                showAddCategory = true
            }) {
                Text("Add New Category")
                    .font(.headline)
                    .foregroundColor(.blue)
            }
            .sheet(isPresented: $showAddCategory) {
                AddCategoryExerciseSheetView { newCategory in
                    categories.append(newCategory)
                    selectedCategory = newCategory
                }
            }

            Menu {
                ForEach(routines) { routine in
                    Button(action: {
                        selectedRoutine = routine
                    }) {
                        Text(routine.name)
                    }
                }
            } label: {
                Text(selectedRoutine?.name ?? "Select Routine")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
            }

            Button(action: addExercise) {
                Text("Add Exercise")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .padding(.horizontal)

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
            }
        }
        .navigationTitle("Add Exercise")
        .padding()
        .background(Color(.systemGroupedBackground))
        .onAppear {
            fetchCategories()
            fetchRoutines()
        }
        .dismissKeyboardOnTap()
    }

    private func addExercise() {
        guard let category = selectedCategory else {
            errorMessage = "Please select a category"
            return
        }
        guard let routine = selectedRoutine else {
            errorMessage = "Please select a routine"
            return
        }

        switch descType {
        case .sets:
            exerciseDesc = "\(sets) sets of \(reps)"
        case .duration:
            exerciseDesc = "\(duration) \(durationUnit.rawValue)"
        case .other:
            break
        }

        NetworkManager.shared.addExercise(name: exerciseName, desc: exerciseDesc, categoryId: category.id, routineId: routine.id) { result in
            switch result {
            case .success:
                break
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func fetchCategories() {
        NetworkManager.shared.fetchCategories { result in
            switch result {
            case .success(let categories):
                DispatchQueue.main.async {
                    self.categories = categories.filter { $0.type == "Exercise" }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
            }
        }
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
}
