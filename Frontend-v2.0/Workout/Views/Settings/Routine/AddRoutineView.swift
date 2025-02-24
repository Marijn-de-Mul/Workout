import SwiftUI

struct AddRoutineView: View {
    @State private var routineName: String = ""
    @State private var routineDesc: String = ""
    @State private var selectedCategory: Category?
    @State private var categories: [Category] = []
    @State private var errorMessage: String?
    @State private var showAddCategory = false

    var body: some View {
        VStack(spacing: 20) {
            TextField("Routine Name", text: $routineName)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            TextField("Routine Description", text: $routineDesc)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())

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
                AddCategoryRoutineSheetView { newCategory in
                    categories.append(newCategory)
                    selectedCategory = newCategory
                }
            }

            Button(action: addRoutine) {
                Text("Add Routine")
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
        .navigationTitle("Add Routine")
        .padding()
        .background(Color(.systemGroupedBackground))
        .onAppear {
            fetchCategories()
        }
        .dismissKeyboardOnTap()
    }

    private func addRoutine() {
        guard let category = selectedCategory else {
            errorMessage = "Please select a category"
            return
        }

        NetworkManager.shared.addRoutine(name: routineName, desc: routineDesc, categoryId: category.id) { result in
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
                    self.categories = categories.filter { $0.type == "Routine" }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
