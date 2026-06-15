<?php
namespace App\Repositories;

use App\Config\DatabaseConnection;
use App\Models\BookModel;
use PDO;
use PDOException;
use RuntimeException;

class BookRepository
{
    // declare $conn to store the database connection
    private PDO $conn;

    public function __construct()
    {
        // conn = database connection instance
        $this->conn = DatabaseConnection::getInstance();
    }

    /* Add new Book */
    public function saveBook(BookModel $book): bool // $book represents all data in BookModel
    {
        try {
            $sql = "
                INSERT INTO books (
                    author_id,
                    category_id,
                    price,
                    stock,
                    description,
                    published_date,
                    title,
                    book_img
                ) VALUES (
                    :author_id,
                    :category_id,
                    :price,
                    :stock,
                    :description,
                    :published_date,
                    :title,
                    :book_img
                )
            ";

            $ps = $this->conn->prepare($sql);

            $ps->bindValue(':author_id', $book->getAuthorId(), PDO::PARAM_INT);
            $ps->bindValue(':category_id', $book->getCategoryId(), PDO::PARAM_INT);
            $ps->bindValue(':price', $book->getPrice());
            $ps->bindValue(':stock', $book->getStock(), PDO::PARAM_INT);
            $ps->bindValue(':description', $book->getDescription(), PDO::PARAM_STR);
            $ps->bindValue(':published_date', $book->getPublishedDate());
            $ps->bindValue(':title', $book->getTitle(), PDO::PARAM_STR);
            $ps->bindValue(':book_img', $book->getBookImage(), PDO::PARAM_STR);

            return $ps->execute();

        } catch (PDOException $e) {
            throw new RuntimeException('Error saving book: ' . $e->getMessage());
        }
    }
    /* Get All books */
public function index(?int $categoryId = null): array
{
    try {
        if ($categoryId !== null) {
            $sql = "
                SELECT 
                    b.*,
                    a.name AS author_name,
                    c.name AS category_name
                FROM books b
                LEFT JOIN authors    a ON b.author_id   = a.id
                LEFT JOIN categories c ON b.category_id = c.id
                WHERE b.category_id = :category_id
                ORDER BY b.id DESC
            ";
            $ps = $this->conn->prepare($sql);
            $ps->bindParam(':category_id', $categoryId, PDO::PARAM_INT);
            $ps->execute();
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        }

        $sql = "
            SELECT 
                b.*,
                a.name AS author_name,
                c.name AS category_name
            FROM books b
            LEFT JOIN authors    a ON b.author_id   = a.id
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.id DESC
        ";
        $ps  = $this->conn->query($sql);
        return $ps->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        throw new RuntimeException('Error to get all books: ' . $e->getMessage());
    }
}

/* Get book by id */
public function getID(int $id): ?array
{
    try {
        $sql = "
            SELECT 
                b.*,
                a.name AS author_name,
                c.name AS category_name
            FROM books b
            LEFT JOIN authors    a ON b.author_id   = a.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.id = :id
        ";
        $ps = $this->conn->prepare($sql);
        $ps->bindParam(':id', $id, PDO::PARAM_INT);
        $ps->execute();

        $result = $ps->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    } catch (PDOException $e) {
        throw new RuntimeException('Error getting book by ID: ' . $e->getMessage());
    }
}
    /*
        Delete book by id
    */
    public function delete(int $id){
         try{
            $sql = "DELETE FROM books WHERE id = :id";;
            $ps = $this->conn->prepare($sql);
            $ps->bindParam(':id', $id, PDO::PARAM_INT);
            $ps->execute();

            return $ps->rowCount() > 0;

        }catch (PDOException $e){
            throw new RuntimeException('Error to delete book' . $e->getMessage());
        }
    }
    /*
        Update 
    */

    public function update(int $id, BookModel $book): bool
    {
        try {
            $sql = "
                UPDATE books SET
                    author_id = :author_id,
                    category_id = :category_id,
                    price = :price,
                    stock = :stock,
                    description = :description,
                    published_date = COALESCE(:published_date, published_date),
                    title = :title,
                    book_img = COALESCE(:book_img, book_img)
                WHERE id = :id
            ";

            $ps = $this->conn->prepare($sql);

            $ps->bindValue(':author_id', $book->getAuthorId(), PDO::PARAM_INT);
            $ps->bindValue(':category_id', $book->getCategoryId(), PDO::PARAM_INT);
            $ps->bindValue(':price', $book->getPrice());
            $ps->bindValue(':stock', $book->getStock(), PDO::PARAM_INT);
            $ps->bindValue(':description', $book->getDescription(), PDO::PARAM_STR);
            $ps->bindValue(':published_date', $book->getPublishedDate());
            $ps->bindValue(':title', $book->getTitle(), PDO::PARAM_STR);
            $ps->bindValue(':book_img', $book->getBookImage());
            $ps->bindValue(':id', $id, PDO::PARAM_INT);

            return $ps->execute();

        } catch (PDOException $e) {
            throw new RuntimeException('Error updating book: ' . $e->getMessage());
        }
    }

    /* Get All Authors */
    public function getAuthors(): array
    {
        try {
            $sql = "SELECT id, name FROM authors ORDER BY name ASC";
            $ps = $this->conn->query($sql);
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException('Error fetching authors: ' . $e->getMessage());
        }
    }

    /* Get All Categories */
    public function getCategories(): array
    {
        try {
            $sql = "SELECT id, name FROM categories ORDER BY name ASC";
            $ps = $this->conn->query($sql);
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new RuntimeException('Error fetching categories: ' . $e->getMessage());
        }
    }

    public function saveCategory(string $name): bool
    {
        try {
            $sql = "INSERT INTO categories (name) VALUES (:name)";
            $ps = $this->conn->prepare($sql);
            $ps->bindValue(':name', $name, PDO::PARAM_STR);
            return $ps->execute();
        } catch (PDOException $e) {
            throw new RuntimeException('Error saving category: ' . $e->getMessage());
        }
    }

    public function updateCategory(int $id, string $name): bool
    {
        try {
            $sql = "UPDATE categories SET name = :name WHERE id = :id";
            $ps = $this->conn->prepare($sql);
            $ps->bindValue(':name', $name, PDO::PARAM_STR);
            $ps->bindValue(':id', $id, PDO::PARAM_INT);
            $ps->execute();
            return $ps->rowCount() > 0;
        } catch (PDOException $e) {
            throw new RuntimeException('Error updating category: ' . $e->getMessage());
        }
    }

    public function deleteCategory(int $id): bool
    {
        try {
            $sql = "DELETE FROM categories WHERE id = :id";
            $ps = $this->conn->prepare($sql);
            $ps->bindValue(':id', $id, PDO::PARAM_INT);
            $ps->execute();
            return $ps->rowCount() > 0;
        } catch (PDOException $e) {
            throw new RuntimeException('Error deleting category: ' . $e->getMessage());
        }
    }
}
