import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocketStore } from "../store/useSocketStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

let typingTimeout = null;

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const socket = useSocketStore((state) => state.socket);

  // TYPING EVENT
  const handleTyping = () => {
    if (!socket || !selectedUser) return;

    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  };

  // IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed!");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    socket.emit("stopTyping", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    setText("");
    setImagePreview(null);
  };

  return (
    <div className="p-4 w-full">

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-base-200 rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full rounded-lg"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
          />

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
          />

          <button
            type="button"
            className="btn btn-circle hidden sm:flex"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button type="submit" className="btn btn-circle btn-sm">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
