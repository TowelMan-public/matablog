package com.matamercer.microblog.utilities

import org.springframework.beans.factory.annotation.Autowired
import kotlin.Throws
import java.net.InetAddress
import org.springframework.validation.ObjectError
import org.springframework.validation.FieldError
import java.util.stream.Collectors
import lombok.NoArgsConstructor
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import java.net.UnknownHostException

@Component
class EnvironmentUtil {
    @Autowired
    var environment: Environment? = null
    private var port: String? = null
        get() {
            if (field == null) field = environment!!.getProperty("local.server.port")
            return field
        }

    @get:Throws(UnknownHostException::class)
    private var hostname: String? = null
        get() {
            if (field == null) field = InetAddress.getLocalHost().hostAddress
            return field
        }
    private val portAsInt: Int
        get() = Integer.valueOf(port)

    @get:Throws(UnknownHostException::class)
    val serverUrl: String
        get() = "http://$hostname:$port"
}