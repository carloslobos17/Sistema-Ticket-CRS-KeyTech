
export const initialBaseUserForm = {
    name: '',
    email: '',
    phone_number: '',
    ext: null,
    birthdate: '',
    department_id: null,
    role: ''
};

// Para la creación, podrías extenderlo así:
export const initialUserFormData = {
    ...initialBaseUserForm,
    password: ''
};

// Para la actualización:
export const initialUpdateUserFormData = {
    ...initialBaseUserForm,
    password: ''
};