const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id, title, tags, body, createdAt, updatedAt
    };
    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length;
    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Add notes success',
            data: {
                noteId: id
            }
        }); 
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Add notes failed',        
    }); 
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if(note !== undefined) {
        return {
            status: 'success',
            data: {
                note
            }
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Note is not found',    
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Update note success'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Failed to update notes, ID is not found',    
    });
    response.code(404);
    return response;
};

const deleteNoteByIDHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {
        notes.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Delete note success'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Failed to delete note, ID is not found',    
    });
    response.code(404);
    return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIDHandler };