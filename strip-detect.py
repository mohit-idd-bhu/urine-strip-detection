import cv2
import json

def generate_roi():
    image = cv2.imread('./uploads/image.jpg')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea)
    x,y,w,h = cv2.boundingRect(largest_contour)
    roi = image[0:image.shape[0], x+30:x+w-30]
    return roi

def generate_colors(roi):
    obj={}
    colors=["URO", 'BIL', 'KET','BLD' ,'PRO' ,'NIT' ,'LEU' ,'GLU' ,'SG' ,'PH']
    image = roi
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    x1, y1 = 0,40
    x2, y2 = image.shape[1],90
    for i in range(9):
        roi = image[y1:y2, x1:x2]
        mean_color = cv2.mean(roi)
        obj[colors[i]]=mean_color[:3]
        y1=y2+40
        y2=y1+50
    return obj


if __name__ == "__main__":
    roi=generate_roi()
    data=generate_colors(roi)
    json_data = json.dumps(data)
    print(json_data)
    