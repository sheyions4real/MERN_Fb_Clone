// used to create a redux reducer to manamage state for loading and error and post
export function postReducer(state, action) {
  switch (action.type) {
    case "POST_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POST_SUCCESS":
      return { ...state, loading: false, posts: action.payload, error: "" };
    case "POST_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function profileReducer(state, action) {
  switch (action.type) {
    case "PROFILE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PROFILE_SUCCESS":
      return {
        ...state.profile,
        loading: false,
        profile: action.payload,
        error: "",
      };
    case "PROFILE_POST":
      return {
        ...state,
        loading: false,
        profile: { ...state, posts: action.payload },
        error: "",
      };
    case "PROFILE_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function photosReducer(state, action) {
  switch (action.type) {
    case "PHOTOS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PHOTOS_SUCCESS":
      return { ...state, loading: false, photos: action.payload, error: "" };
    case "PHOTOS_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function friendspage(state, action) {
  switch (action.type) {
    case "FRIENDS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FRIENDS_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: "",
      };
    case "FRIENDS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
