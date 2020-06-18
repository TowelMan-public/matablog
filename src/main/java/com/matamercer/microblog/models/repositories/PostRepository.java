package com.matamercer.microblog.models.repositories;

import com.matamercer.microblog.models.entities.Blog;
import com.matamercer.microblog.models.entities.Post;
import com.matamercer.microblog.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByBlog(Blog blog, Pageable pageRequest);

//    @Query("SELECT p FROM Post p INNER JOIN l.user u WHERE u.username = :username")
//    Page<Post> findByQuery(Pageable pageRequest);
}
